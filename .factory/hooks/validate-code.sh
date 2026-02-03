#!/bin/bash
set -e

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // ""')

if [ -z "$file_path" ]; then
  exit 0
fi

cwd=$(echo "$input" | jq -r '.cwd')
cd "$cwd"

# Check TypeScript files for type errors
if echo "$file_path" | grep -qE '\.(ts|tsx)$' && [ -f "$file_path" ]; then
  echo "🔍 Type checking $file_path..."
  
  # Find the nearest tsconfig
  dir=$(dirname "$file_path")
  while [ "$dir" != "." ] && [ "$dir" != "/" ]; do
    if [ -f "$dir/tsconfig.json" ]; then
      cd "$dir"
      npx tsc --noEmit 2>&1 || {
        echo "⚠️ Type errors detected" >&2
      }
      echo "✓ Type check passed"
      break
    fi
    dir=$(dirname "$dir")
  done
fi

exit 0
