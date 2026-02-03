#!/bin/bash
set -e

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // ""')

if [ -z "$file_path" ] || [ ! -f "$file_path" ]; then
  exit 0
fi

cwd=$(echo "$input" | jq -r '.cwd')
cd "$cwd"

case "$file_path" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.md|*.mdx)
    if command -v pnpm &> /dev/null; then
      pnpm check --write "$file_path" 2>&1 || true
      echo "✓ Formatted with Biome: $file_path"
    fi
    ;;
esac

exit 0
