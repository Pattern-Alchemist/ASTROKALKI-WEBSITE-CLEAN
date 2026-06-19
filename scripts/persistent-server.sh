#!/bin/bash
cd /home/z/my-project

# Start the static server in background
python3 /home/z/my-project/scripts/serve-static.py &
SERVER_PID=$!

# Wait for it to start
sleep 2

# Verify it's running
if curl -s -o /dev/null http://localhost:3000; then
  echo "SERVER_OK"
else
  echo "SERVER_FAILED"
fi

# Keep this script alive by waiting on the server process
# This prevents the parent shell from cleaning up
wait $SERVER_PID
