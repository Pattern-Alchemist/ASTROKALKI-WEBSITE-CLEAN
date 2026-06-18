#!/bin/bash
# Respawn server script - keeps port 3000 alive
# If the Next.js server dies, it restarts it automatically

cd /home/z/my-project

while true; do
  echo "[$(date)] Starting Next.js server..."
  NODE_OPTIONS="--max-old-space-size=256" npx next start -p 3000 -H 0.0.0.0 2>&1
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE, restarting in 2s..."
  sleep 2
done
