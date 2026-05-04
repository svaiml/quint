#!/bin/bash
# Clone the entire zombo-sash-eco ecosystem.
# Usage: ./clone-ecosystem.sh [target-dir]
# Default target: ./zombo-sash-eco

set -e
TARGET="${1:-zombo-sash-eco}"
mkdir -p "$TARGET" && cd "$TARGET"

echo "Cloning ecosystem into $(pwd)..."

mkdir -p apps infra-eco reasoning-universe epistemic-universe prodx prodx-external tools/ai-tools tools/orchestrator

clone() { echo "  $2"; git clone --quiet "$1" "$2" 2>/dev/null || echo "    SKIP (already exists or no access)"; }

# ── apps ──
clone git@github.com:svaiml/code-catalyst.git apps/code-catalyst
clone git@github.com:zombocoder/reasoning-apps.git apps/reasoning-apps

# ── reasoning-universe ──
clone git@github.com:zombocoder/infer.git reasoning-universe/infer
clone git@github.com:zombocoder/pctl-rs.git reasoning-universe/pctl-rs
clone git@github.com:zombocoder/zz-notation.git reasoning-universe/zz-notation
clone git@github.com:svaiml/fpf-cards.git reasoning-universe/fpf-cards
clone git@github.com:zombocoder/axiomvm.git reasoning-universe/axiomvm
clone git@github.com:zombocoder/aivm.git reasoning-universe/aivm
clone git@github.com:svaiml/craftegy-algo.git reasoning-universe/craftegy-algo
clone git@github.com:zombocoder/obstruct.git reasoning-universe/obstruct

# ── epistemic-universe ──
clone git@github.com:svaiml/criterium.git epistemic-universe/criterium

# ── infra-eco ──
clone git@github.com:sashml/o2l.git infra-eco/o2l
clone git@github.com:rstmdb/rstmdb.git infra-eco/rstmdb
clone git@github.com:rstmdb/rstmdb-studio.git infra-eco/rstmdb-studio
clone git@github.com:zombocoder/inferense.git infra-eco/inferense
clone git@github.com:zombocoder/invariantis.git infra-eco/invariantis
clone git@github.com:zombocoder/ctop.git infra-eco/ctop
clone git@github.com:zombocoder/bfc.git infra-eco/bfc
clone git@github.com:zombocoder/myria.git infra-eco/myria
clone git@github.com:zombocoder/vaultura.git infra-eco/vaultura
clone git@github.com:zombocoder/npd-cipher.git infra-eco/npd-cipher
clone git@github.com:zombocoder/go-freebsd-pf.git infra-eco/go-freebsd-pf

# ── prodx ──
clone git@github.com:svaiml/craftegy-design.git prodx/craftegy-design

# ── prodx-external (read-only) ──
clone https://github.com/ag2ai/ag2.git prodx-external/AgentOS
clone https://github.com/eclectix7/DesignOS.git prodx-external/DesignOS
clone https://github.com/OpenCoworkAI/open-codesign.git prodx-external/open-codesign

# ── tools/ai-tools ──
clone git@github.com:sashml/flowspec.git tools/ai-tools/flowspec
clone git@github.com:Jakedismo/codegraph-rust.git tools/ai-tools/codegraph-rust
clone https://github.com/DeusData/codebase-memory-mcp.git tools/ai-tools/codebase-memory-mcp
clone https://github.com/m0n0x41d/haft.git tools/ai-tools/haft
clone https://github.com/ailev/FPF.git tools/ai-tools/FPF
clone git@github.com:svaiml/fpf-problem-solving-skill.git tools/ai-tools/fpf-problem-solving-skill
clone https://github.com/informalsystems/quint.git tools/ai-tools/quint
clone git@github.com:zombocoder/ghdash.git tools/ai-tools/ghdash
clone git@github.com:zombocoder/zacta.git tools/ai-tools/zacta
clone https://github.com/safishamsi/graphify.git tools/ai-tools/graphify
clone https://github.com/osovv/grace-marketplace.git tools/ai-tools/grace-marketplace
clone https://github.com/BalaBenna/grace-skills.git tools/ai-tools/grace-skills

# ── tools/orchestrator ──
clone https://github.com/Dicklesworthstone/beads_rust.git tools/orchestrator/beads_rust
clone https://github.com/Dicklesworthstone/beads_viewer_rust.git tools/orchestrator/beads_viewer_rust
clone https://github.com/thrashr888/AllBeads.git tools/orchestrator/AllBeads
clone https://github.com/paperclipai/paperclip.git tools/orchestrator/PaperClip
clone https://github.com/gsd-build/gsd-2.git tools/orchestrator/gsd-2

# ── Copy meta tooling from ZomboCraftEco into the workspace ──
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cp "$SCRIPT_DIR/eco-sync" bin/eco-sync 2>/dev/null || true
mkdir -p bin
echo "#!/bin/bash" > bin/eco-sync-wrapper
echo "uv run python bin/eco-sync \"\$@\"" >> bin/eco-sync-wrapper
chmod +x bin/eco-sync-wrapper

TOTAL=$(find . -maxdepth 3 -name .git -type d | wc -l)
echo ""
echo "Done. $TOTAL repos cloned into $(pwd)"
echo ""
echo "Next steps:"
echo "  cd $(pwd)"
echo "  uv run python bin/eco-sync status    # verify all repos"
echo "  uv run python bin/eco-sync sync      # fetch + pull latest"
echo "  flowspec board                        # project board"
