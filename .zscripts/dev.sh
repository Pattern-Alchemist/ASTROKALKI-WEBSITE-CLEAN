#!/bin/bash

set -uo pipefail

# AstroKalki persistent dev server script
# This script is called by start.sh during container boot.
# It MUST stay alive as long as the server runs, otherwise
# the container's process reaper kills the orphaned server.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

log_step() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

cleanup() {
  if [ -n "${DEV_PID:-}" ] && kill -0 "$DEV_PID" >/dev/null 2>&1; then
    log_step "Stopping server (PID: $DEV_PID)..."
    kill "$DEV_PID" >/dev/null 2>&1 || true
    wait "$DEV_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

cd "$PROJECT_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  log_step "Installing dependencies..."
  bun install 2>&1 || npm install 2>&1
fi

# Try db:push but don't fail if it doesn't work
log_step "Setting up database (if applicable)..."
bun run db:push 2>/dev/null || true

# Build the production version for more stable serving
log_step "Building production bundle..."
npm run build 2>&1 || true

# Start the server
log_step "Starting Next.js server on port 3000..."
npx next start -p 3000 -H 0.0.0.0 &
DEV_PID=$!

# Wait for server to be ready
log_step "Waiting for server to be ready..."
for i in $(seq 1 60); do
  if curl -s -o /dev/null http://localhost:3000 2>/dev/null; then
    log_step "Server is ready! (PID: $DEV_PID)"
    break
  fi
  sleep 1
done

# KEEP THIS SCRIPT ALIVE - do NOT exit!
# If we exit, the process reaper kills our server.
# We wait on the server process indefinitely.
log_step "Server running. This script will stay alive to keep it running."
wait "$DEV_PID"
log_step "Server process ended. Exiting."
