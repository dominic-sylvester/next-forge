#!/bin/bash
set -e

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name')
file_path=$(echo "$input" | jq -r '.tool_input.file_path // ""')

if [ "$tool_name" != "Write" ] && [ "$tool_name" != "Edit" ]; then
  exit 0
fi

if ! echo "$file_path" | grep -qE '\.(ts|tsx|js|jsx)$'; then
  exit 0
fi

if echo "$file_path" | grep -qE '\.(test|spec)\.(ts|tsx|js|jsx)$'; then
  exit 0
fi

cwd=$(echo "$input" | jq -r '.cwd')
cd "$cwd"

echo "🧪 Running tests for changed file..."

# Find the app directory
app_dir=""
if echo "$file_path" | grep -q "^apps/app/"; then
  app_dir="apps/app"
elif echo "$file_path" | grep -q "^apps/api/"; then
  app_dir="apps/api"
elif echo "$file_path" | grep -q "^apps/storybook/"; then
  app_dir="apps/storybook"
fi

if [ -n "$app_dir" ] && [ -f "$app_dir/package.json" ]; then
  if grep -q '"test"' "$app_dir/package.json"; then
    cd "$app_dir"
    pnpm test --run 2>&1 || {
      echo "❌ Tests failed in $app_dir" >&2
      exit 2
    }
    echo "✓ Tests passed in $app_dir"
  fi
fi

exit 0
