#!/usr/bin/env python3
"""
PostToolUse hook: Adaptive epic auto-suggest for new beads tasks.

Fires after every Bash tool use that creates a task (br create / br q).
Primary signal : graph-neighborhood Jaccard via `br graph --all --json`
Secondary signal: text recall  |task_terms ∩ epic_terms| / |task_terms|

No hardcoded keyword lists — adapts automatically as new epics are created.
Returns {"continue": true} always (fail-open).
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from collections import defaultdict

# ── Tuning ────────────────────────────────────────────────────────────────────
GRAPH_WEIGHT        = 0.65
TEXT_WEIGHT         = 0.35
CONFIDENT_THRESHOLD = 0.10
AMBIGUOUS_GAP       = 0.04
STOPWORDS = {
    "the", "a", "an", "and", "or", "for", "to", "of", "in", "with", "as",
    "is", "are", "was", "be", "by", "at", "on", "from", "this", "that",
    "it", "we", "our", "has", "have", "not", "no", "via", "vs", "per",
    "all", "its", "into", "each", "using", "based", "new", "use", "add",
    "и", "в", "на", "с", "по", "из", "к", "от", "за", "при", "для",
    "что", "как", "не", "но", "он", "она", "они", "это",
}

CONTINUE = json.dumps({"continue": True})


def run_json(cmd: list[str]) -> list | dict | None:
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        return json.loads(r.stdout)
    except Exception:
        return None


def extract_terms(text: str) -> set[str]:
    words = re.findall(r"[a-zа-яA-ZА-Я0-9\-]+", text.lower())
    words = [w for w in words if w not in STOPWORDS and len(w) >= 2]
    unigrams = set(words)
    bigrams  = {f"{words[i]} {words[i+1]}" for i in range(len(words) - 1)}
    return unigrams | bigrams


def text_recall(task_terms: set[str], epic_terms: set[str]) -> float:
    if not task_terms:
        return 0.0
    return len(task_terms & epic_terms) / len(task_terms)


def nbr_jaccard(a: set[str], b: set[str]) -> float:
    union = a | b
    return len(a & b) / len(union) if union else 0.0


def load_graph() -> dict[str, set[str]]:
    data = run_json(["br", "graph", "--all", "--json"]) or {}
    nbrs: dict[str, set[str]] = defaultdict(set)
    for comp in data.get("components", []):
        for a, b in comp.get("edges", []):
            nbrs[a].add(b)
            nbrs[b].add(a)
    return dict(nbrs)


def load_epic_index(all_issues: dict) -> dict[str, tuple[str, set[str]]]:
    """Return {epic_id: (title, term_set)}."""
    parent_ids: set[str] = set()
    for iid in all_issues:
        parts = iid.split("-", 1)
        if len(parts) == 2 and "." in parts[1]:
            parent_ids.add(f"{parts[0]}-{parts[1].split('.')[0]}")

    index: dict[str, tuple[str, set[str]]] = {}
    for iid, i in all_issues.items():
        if (i.get("issue_type") == "epic"
                or iid in parent_ids
                or "epic:" in i.get("title", "").lower()):
            text = f"{i.get('title', '')} {i.get('description', '') or ''}"
            index[iid] = (i.get("title", iid), extract_terms(text))
    return index


def suggest_for_task(
    task_id: str,
    all_issues: dict,
    epic_index: dict[str, tuple[str, set[str]]],
    graph: dict[str, set[str]],
) -> str | None:
    task = all_issues.get(task_id)
    if not task:
        raw = run_json(["br", "show", task_id, "--json"])
        if not raw or not isinstance(raw, dict):
            return None
        task = raw

    if task.get("dependency_count", 0) > 0:
        return None  # already wired

    text = f"{task.get('title', '')} {task.get('description', '') or ''}"
    task_terms = extract_terms(text)
    task_nbrs  = graph.get(task_id, set())

    scores = []
    for eid, (etitle, eterms) in epic_index.items():
        g = 1.0 if eid in task_nbrs else nbr_jaccard(task_nbrs, graph.get(eid, set()))
        t = text_recall(task_terms, eterms)
        scores.append((eid, GRAPH_WEIGHT * g + TEXT_WEIGHT * t, g, t))

    scores.sort(key=lambda x: -x[1])
    above = [(eid, c, g, t) for eid, c, g, t in scores if c >= CONFIDENT_THRESHOLD]

    if not above:
        return None

    title = task.get("title", task_id)[:55]
    lines = [f"  Epic suggestion for {task_id}: {title}"]

    if len(above) == 1 or (above[0][1] - above[1][1] >= AMBIGUOUS_GAP):
        best_id, best_c, best_g, best_t = above[0]
        best_title = epic_index[best_id][0][:40]
        lines.append(f"     → {best_id}  {best_title}  (score={best_c:.3f} graph={best_g:.2f} text={best_t:.2f})")
        lines.append(f"     Run: br dep add {task_id} {best_id}")
    else:
        lines.append(f"     ambiguous — top matches:")
        for eid, c, g, t in above[:3]:
            etitle = epic_index[eid][0][:35]
            lines.append(f"       {c:.3f}  {eid}  {etitle}")

    return "\n".join(lines)


def main() -> None:
    try:
        data = json.load(sys.stdin)
    except Exception:
        print(CONTINUE)
        return

    if data.get("tool_name") != "Bash":
        print(CONTINUE)
        return

    command = data.get("tool_input", {}).get("command", "")
    if not re.search(r"\bbr\b.*(create|q\b)", command):
        print(CONTINUE)
        return

    tool_output = data.get("tool_response", {})
    output_text = (tool_output.get("output", "")
                   if isinstance(tool_output, dict) else str(tool_output))

    ids = re.findall(r"\b[a-z]+-[a-z0-9]+(?:\.\d+)?\b", output_text)
    if not ids:
        print(CONTINUE)
        return

    try:
        main_list = run_json(["br", "list", "--limit", "0", "--json"]) or []
        p4_list   = run_json(["br", "list", "-p", "4", "--limit", "0", "--json"]) or []
        all_issues = {i["id"]: i for i in main_list + p4_list}
        epic_index = load_epic_index(all_issues)
        graph      = load_graph()
    except Exception:
        print(CONTINUE)
        return

    suggestions = []
    for task_id in ids[:3]:
        s = suggest_for_task(task_id, all_issues, epic_index, graph)
        if s:
            suggestions.append(s)

    if suggestions:
        msg = "Epic suggestions:\n" + "\n".join(suggestions)
        print(json.dumps({"continue": True, "reason": msg}))
    else:
        print(CONTINUE)


if __name__ == "__main__":
    main()
