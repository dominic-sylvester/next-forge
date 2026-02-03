#!/bin/bash

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // ""')

if [ -z "$file_path" ]; then
  exit 0
fi

# List of protected patterns
protected_patterns=(
  "\.env\.local$"
  "\.env\.production"
  "package-lock\.json$"
  "yarn\.lock$"
  "pnpm-lock\.yaml$"
  "\.git/"
  "node_modules/"
  "\.next/"
  "dist/"
  "\.pem$"
  "\.key$"
  "credentials\.json$"
  "packages/database/generated/"
)

for pattern in "${protected_patterns[@]}"; do
  if echo "$file_path" | grep -qE "$pattern"; then
    echo "❌ Cannot modify protected file: $file_path" >&2
    echo "This file is protected by project policy." >&2
    exit 2
  fi
done

exit 0
