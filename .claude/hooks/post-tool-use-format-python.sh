#!/bin/bash
#
# PostToolUse hook: Auto-format Python files
#
# Runs 'ruff format' on Python files after Edit/Write operations
# Returns JSON with continue:true (PostToolUse schema, NOT decision:allow)
#
# IMPORTANT: No strict mode - uses fail-open principle

# Fail-open helper — PostToolUse uses {"continue":true}, NOT {"decision":"allow"}
continue_and_exit() {
    local reason="${1:-ok}"
    echo "{\"continue\":true,\"reason\":\"$reason\"}"
    exit 0
}

# Read JSON input from stdin (fail-open if cat fails)
input=$(cat 2>/dev/null) || continue_and_exit "failed to read stdin"

# Extract tool name and file path using jq if available, otherwise use Python
if command -v jq &> /dev/null; then
    tool_name=$(echo "$input" | jq -r '.tool_name // ""' 2>/dev/null) || tool_name=""
    file_path=$(echo "$input" | jq -r '.tool_input.file_path // ""' 2>/dev/null) || file_path=""
elif command -v python3 &> /dev/null; then
    # Fallback to Python for JSON parsing
    tool_name=$(echo "$input" | python3 -c "import json, sys; data = json.load(sys.stdin); print(data.get('tool_name', ''))" 2>/dev/null) || tool_name=""
    file_path=$(echo "$input" | python3 -c "import json, sys; data = json.load(sys.stdin); print(data.get('tool_input', {}).get('file_path', ''))" 2>/dev/null) || file_path=""
else
    continue_and_exit "no JSON parser available"
fi

# Only process Write and Edit tools
if [[ "$tool_name" != "Write" && "$tool_name" != "Edit" ]]; then
    continue_and_exit "not a Write/Edit tool"
fi

# Check if file is a Python file
if [[ ! "$file_path" =~ \.py$ ]]; then
    continue_and_exit "not a Python file"
fi

# Check if file exists
if [[ ! -f "$file_path" ]]; then
    continue_and_exit "file does not exist"
fi

# Check if ruff is available
if ! command -v ruff &> /dev/null; then
    continue_and_exit "ruff not installed"
fi

# Run ruff format (fail-open on any error)
if ruff format "$file_path" 2>&1 | grep -q "reformatted"; then
    echo "{\"continue\":true,\"reason\":\"formatted $file_path\"}"
else
    continue_and_exit "no formatting needed"
fi

exit 0
