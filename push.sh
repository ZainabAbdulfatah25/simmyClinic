#!/bin/bash

# 1. Stage all changes (new assets, code edits, configuration changes)
git add .

# 2. Set commit message (use custom message if passed as argument, otherwise use default with timestamp)
COMMIT_MSG="$1"
if [ -z "$COMMIT_MSG" ]; then
  COMMIT_MSG="chore: update simmyClinic platform - $(date '+%Y-%m-%d %H:%M:%S')"
fi

# 3. Commit local changes first
git commit -m "$COMMIT_MSG" || true

# 4. Fetch latest remote and rebase cleanly
git rebase --abort 2>/dev/null || true
git fetch origin main
git rebase origin/main || git rebase --skip || true

# 5. Push to GitHub
git push origin main



