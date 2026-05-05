#!/bin/bash
# Install all ecosystem CLI tools from source.
# Run from inside the cloned ecosystem directory.
#
# Supports: Linux, macOS, Windows (Git Bash / MSYS2)

set -e
ECO="${1:-.}"

# Detect platform
case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*) IS_WINDOWS=true ;;
  *)                     IS_WINDOWS=false ;;
esac

# Determine install prefix
if $IS_WINDOWS; then
  INSTALL_BIN="${LOCALAPPDATA:-$USERPROFILE/AppData/Local}/Programs/bin"
  EXE=".exe"
else
  INSTALL_BIN="$HOME/.local/bin"
  EXE=""
fi
mkdir -p "$INSTALL_BIN"

echo "Installing ecosystem tools..."
echo "  Platform: $(uname -s), install dir: $INSTALL_BIN"

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
if $IS_WINDOWS; then
  cmake -B build -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX="$INSTALL_BIN/.." 2>&1 | tail -1
  cmake --build build --config Release 2>&1 | tail -1
  cp "build/Release/zacta${EXE}" "$INSTALL_BIN/zacta${EXE}" 2>/dev/null || \
    cp "build/zacta${EXE}" "$INSTALL_BIN/zacta${EXE}" 2>/dev/null || true
else
  cmake -B build -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX="$HOME/.local" 2>&1 | tail -1
  cmake --build build 2>&1 | tail -1
  cp build/zacta "$INSTALL_BIN/zacta" 2>/dev/null || true
fi
cd -

echo ""
echo "Installed: br, bvr, flowspec, ghdash, zacta"
echo "Verify: br --version && flowspec --version && ghdash --version"
if $IS_WINDOWS; then
  echo ""
  echo "Ensure $INSTALL_BIN is in your PATH."
  echo "  PowerShell: \$env:PATH += \";$INSTALL_BIN\""
fi
