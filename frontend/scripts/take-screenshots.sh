#!/usr/bin/env bash
#
# Take screenshots of the app using repo-common-take-screenshot.
# Start the app first (e.g. npm run dev or docker run -p 8080:80 ...).
#
# Usage: ./scripts/take-screenshots.sh [base_url]
#   base_url defaults to http://localhost:5173

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="${SCRIPT_DIR}/../screenshots"
BASE_URL="${1:-http://localhost:5173}"

mkdir -p "$OUT_DIR"

echo "Taking screenshots (base URL: $BASE_URL) into $OUT_DIR"

repo-common-take-screenshot home "${BASE_URL}"
repo-common-take-screenshot app "${BASE_URL}"
repo-common-take-screenshot flywheel "${BASE_URL}"

echo "Done. Screenshots saved to $OUT_DIR"
