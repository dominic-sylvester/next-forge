#!/bin/bash

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name')
file_path=$(echo "$input" | jq -r '.tool_input.file_path // ""')

if [ "$tool_name" != "Write" ] && [ "$tool_name" != "Edit" ]; then
  exit 0
fi

if echo "$file_path" | grep -qE '\.(jpg|png|gif|pdf|zip|tar|gz|lock|yaml)$'; then
  exit 0
fi

if echo "$file_path" | grep -qE '\.env\.example$'; then
  exit 0
fi

content=""
if [ "$tool_name" = "Write" ]; then
  content=$(echo "$input" | jq -r '.tool_input.content // ""')
elif [ -f "$file_path" ]; then
  content=$(cat "$file_path")
fi

if [ -z "$content" ]; then
  exit 0
fi

temp_file=$(mktemp)
echo "$content" > "$temp_file"

found_secrets=0

# Check for common secret patterns
secret_patterns=(
  "AKIA[0-9A-Z]{16}"
  "AIza[0-9A-Za-z\\-_]{35}"
  "sk-[a-zA-Z0-9]{32,}"
  "ghp_[a-zA-Z0-9]{36}"
  "glpat-[a-zA-Z0-9\\-]{20}"
  "sk_live_[a-zA-Z0-9]{24}"
  "sk_test_[a-zA-Z0-9]{24}"
  "re_[a-zA-Z0-9]{32}"
)

for pattern in "${secret_patterns[@]}"; do
  if grep -qE "$pattern" "$temp_file"; then
    echo "❌ Potential secret detected matching pattern: $pattern" >&2
    found_secrets=1
  fi
done

rm "$temp_file"

if [ $found_secrets -eq 1 ]; then
  echo "" >&2
  echo "Please use environment variables instead of hardcoding secrets." >&2
  exit 2
fi

exit 0
