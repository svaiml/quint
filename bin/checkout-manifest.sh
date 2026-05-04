#!/bin/bash
set -e
ECO="${1:-$HOME/zombo-sash-eco}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MANIFEST="$SCRIPT_DIR/../manifest.json"
[ -f "$MANIFEST" ] || { echo "Error: manifest.json not found"; exit 1; }
echo "Checking out manifest branches in $ECO..."
uv run python -c "
import json, subprocess
with open('$MANIFEST') as f:
    repos = json.load(f)
for r in repos:
    path = f'$ECO/{r[\"group\"]}/{r[\"name\"]}'
    result = subprocess.run(['git', '-C', path, 'checkout', r['branch']], capture_output=True, text=True, timeout=10)
    status = 'ok' if result.returncode == 0 else 'SKIP'
    print(f'  {r[\"group\"]}/{r[\"name\"]}: {r[\"branch\"]} [{status}]')
"
echo "Done."
