#!/bin/zsh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

projects=(
  "slopularity"
  "ARCHIVE/365 buttons"
  "ARCHIVE/fun-internet-museum"
  "ARCHIVE/pixel-pop-arcade"
  "ARCHIVE/pocket-zoo"
  "ARCHIVE/quiet-collapse"
  "ARCHIVE/scrollbreak"
  "ARCHIVE/slopternet"
  "ARCHIVE/time-capsules"
)

echo "Restoring Hurricane Hackathon npm dependencies"
echo "Root: $ROOT"
echo

for project in "${projects[@]}"; do
  project_dir="$ROOT/$project"

  if [[ ! -f "$project_dir/package.json" ]]; then
    echo "Skipping $project: package.json not found"
    continue
  fi

  if [[ -d "$project_dir/node_modules" ]]; then
    echo "Already ready: $project"
    continue
  fi

  echo "Installing: $project"
  cd "$project_dir"

  if [[ -f package-lock.json ]]; then
    npm ci
  else
    npm install
  fi

  echo
done

echo "Done. You can close this window."
