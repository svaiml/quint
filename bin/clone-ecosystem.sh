#!/bin/bash
# Clone the entire zombo-sash-eco ecosystem using gh CLI.
# Prerequisites: gh auth login (works on Linux, macOS, Windows — no SSH keys needed)
# Usage: ./clone-ecosystem.sh [target-dir]
# Default target: current directory (.)

set -e
TARGET="${1:-.}"
mkdir -p "$TARGET" && cd "$TARGET"

echo "Cloning ecosystem into $(pwd)..."
echo "  Prerequisite: gh auth login  (one-time, works on all platforms)"
echo ""

mkdir -p apps infra-eco reasoning-universe epistemic-universe prodx prodx-external tools/ai-tools tools/orchestrator

clone() {
  local repo="$1" dest="$2"
  if [ -d "$dest/.git" ]; then
    echo "  EXISTS  $dest"
  elif gh repo clone "$repo" "$dest" -- --quiet 2>/dev/null; then
    echo "  CLONED  $dest"
  else
    echo "  FAILED  $dest  (check gh auth / repo access)"
  fi
}

# ── apps ──
clone svaiml/code-catalyst              apps/code-catalyst
clone zombocoder/reasoning-apps         apps/reasoning-apps

# ── reasoning-universe ──
clone zombocoder/infer                  reasoning-universe/infer
clone zombocoder/pctl-rs                reasoning-universe/pctl-rs
clone zombocoder/zz-notation            reasoning-universe/zz-notation
clone svaiml/fpf-cards                  reasoning-universe/fpf-cards
clone zombocoder/axiomvm                reasoning-universe/axiomvm
clone zombocoder/aivm                   reasoning-universe/aivm
clone svaiml/craftegy-algo              reasoning-universe/craftegy-algo
clone zombocoder/obstruct               reasoning-universe/obstruct

# ── epistemic-universe ──
clone svaiml/criterium                  epistemic-universe/criterium

# ── infra-eco ──
clone sashml/o2l                        infra-eco/o2l
clone rstmdb/rstmdb                     infra-eco/rstmdb
clone rstmdb/rstmdb-studio              infra-eco/rstmdb-studio
clone zombocoder/inferense              infra-eco/inferense
clone zombocoder/invariantis            infra-eco/invariantis
clone zombocoder/ctop                   infra-eco/ctop
clone zombocoder/bfc                    infra-eco/bfc
clone zombocoder/myria                  infra-eco/myria
clone zombocoder/vaultura               infra-eco/vaultura
clone zombocoder/npd-cipher             infra-eco/npd-cipher
clone zombocoder/go-freebsd-pf          infra-eco/go-freebsd-pf

# ── prodx ──
clone svaiml/craftegy-design            prodx/craftegy-design

# ── prodx-external (public upstream references) ──
clone ag2ai/ag2                         prodx-external/AgentOS
clone eclectix7/DesignOS                prodx-external/DesignOS
clone OpenCoworkAI/open-codesign        prodx-external/open-codesign

# ── tools/ai-tools ──
clone sashml/flowspec                   tools/ai-tools/flowspec
clone svaiml/fpf-problem-solving-skill  tools/ai-tools/fpf-problem-solving-skill
clone Jakedismo/codegraph-rust          tools/ai-tools/codegraph-rust
clone DeusData/codebase-memory-mcp      tools/ai-tools/codebase-memory-mcp
clone m0n0x41d/haft                     tools/ai-tools/haft
clone ailev/FPF                         tools/ai-tools/FPF
clone informalsystems/quint             tools/ai-tools/quint
clone zombocoder/ghdash                 tools/ai-tools/ghdash
clone zombocoder/zacta                  tools/ai-tools/zacta
clone safishamsi/graphify               tools/ai-tools/graphify
clone osovv/grace-marketplace           tools/ai-tools/grace-marketplace
clone BalaBenna/grace-skills            tools/ai-tools/grace-skills

# ── tools/orchestrator ──
clone Dicklesworthstone/beads_rust          tools/orchestrator/beads_rust
clone Dicklesworthstone/beads_viewer_rust   tools/orchestrator/beads_viewer_rust
clone thrashr888/AllBeads                   tools/orchestrator/AllBeads
clone paperclipai/paperclip                 tools/orchestrator/PaperClip
clone gsd-build/gsd-2                       tools/orchestrator/gsd-2

# ── Copy eco tooling into workspace bin/ ──
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
mkdir -p bin
cp "$SCRIPT_DIR/eco-sync" bin/eco-sync 2>/dev/null || true
echo '#!/bin/bash' > bin/eco-sync-wrapper
echo 'uv run python bin/eco-sync "$@"' >> bin/eco-sync-wrapper
chmod +x bin/eco-sync-wrapper

TOTAL=$(find . -maxdepth 3 -name .git -type d | wc -l)
echo ""
echo "Done. $TOTAL repos cloned into $(pwd)"
echo ""
echo "Next steps:"
echo "  uv run python bin/eco-sync status    # verify all repos"
echo "  uv run python bin/eco-sync sync      # fetch + pull latest"
echo "  flowspec board                        # project board"
