#!/bin/bash
# Wrapper script for commitlint that prevents remote fetching errors

# Disable git terminal prompts to prevent interactive prompts
export GIT_TERMINAL_PROMPT=0

# Run commitlint, filtering out git fetch errors
# The commit message file is passed as the first argument after --edit
npx commitlint "$@" 2>&1 | grep -v -E "(fatal: Could not read from remote|ERROR: Repository not found|git fetch)" || {
  # If grep filtered everything, commitlint might have succeeded
  # Re-run without filtering to get the actual exit code
  npx commitlint "$@" > /dev/null 2>&1
  exit $?
}
