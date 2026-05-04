#!/bin/bash
# Sync ADRs and flowspec artifacts from the ecosystem into ZomboCraftEco.
# Run from ZomboCraftEco root. Requires ECO_ROOT pointing to zombo-sash-eco.

set -e
ECO="${ECO_ROOT:-$HOME/zombo-sash-eco}"

if [ ! -d "$ECO/reasoning-universe" ]; then
  echo "Error: ECO_ROOT=$ECO does not look like zombo-sash-eco"
  echo "Set ECO_ROOT=/path/to/zombo-sash-eco"
  exit 1
fi

echo "Syncing docs from $ECO..."

mkdir -p docs/adr docs/assess docs/prd docs/plan docs/research docs/specs

# Umbrella ADRs
cp "$ECO"/docs/adr/ADR-*.md docs/adr/ 2>/dev/null || true

# Nested repo ADRs (prefixed with repo name)
for repo in reasoning-universe/pctl-rs reasoning-universe/infer reasoning-universe/zz-notation epistemic-universe/criterium; do
  reponame=$(basename "$repo")
  adr_dir="$ECO/$repo/docs/adr"
  [ -d "$adr_dir" ] || continue
  for f in "$adr_dir"/ADR-*.md "$adr_dir"/pctl-*.md; do
    [ -f "$f" ] && cp "$f" "docs/adr/${reponame}--$(basename $f)"
  done
done

# Flowspec artifacts
cp "$ECO"/docs/assess/*.md docs/assess/ 2>/dev/null || true
cp "$ECO"/docs/prd/*.md docs/prd/ 2>/dev/null || true
cp "$ECO"/docs/plan/*.md docs/plan/ 2>/dev/null || true
cp "$ECO"/docs/research/*.md docs/research/ 2>/dev/null || true
cp "$ECO"/docs/specs/*.md docs/specs/ 2>/dev/null || true
cp "$ECO"/flowspec_workflow.yml . 2>/dev/null || true

# ECOSYSTEM.md
cp "$ECO"/ECOSYSTEM.md . 2>/dev/null || true

# eco-sync
cp "$ECO"/bin/eco-sync bin/eco-sync 2>/dev/null || true

TOTAL=$(find docs/ -name "*.md" | wc -l)
echo "Synced $TOTAL docs from $ECO"
echo "Run: git diff --stat"
