#!/bin/bash
# Install all ecosystem CLI tools from source.
# Run from inside the cloned ecosystem directory.

set -e
ECO="${1:-.}"

echo "Installing ecosystem tools..."

# br (beads-rust)
echo "  br (beads issue tracker)..."
cargo install --path "$ECO/tools/orchestrator/beads_rust" --force --quiet 2>&1 | tail -1

# bvr (beads viewer)
echo "  bvr (beads viewer)..."
cargo install --path "$ECO/tools/orchestrator/beads_viewer_rust" --force --quiet 2>&1 | tail -1

# flowspec
echo "  flowspec (spec-driven dev)..."
uv tool install --editable "$ECO/tools/ai-tools/flowspec" 2>&1 | tail -1

# ghdash
echo "  ghdash (GitHub dashboard)..."
cargo install --path "$ECO/tools/ai-tools/ghdash" --force --quiet 2>&1 | tail -1

# zacta
echo "  zacta (terminal editor)..."
cd "$ECO/tools/ai-tools/zacta"
cmake -B build -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX="$HOME/.local" 2>&1 | tail -1
cmake --build build 2>&1 | tail -1
cp build/zacta "$HOME/.local/bin/zacta" 2>/dev/null || true
cd -

echo ""
echo "Installed: br, bvr, flowspec, ghdash, zacta"
echo "Verify: br --version && flowspec --version && ghdash --version"
