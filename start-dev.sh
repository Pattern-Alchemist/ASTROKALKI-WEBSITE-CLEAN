#!/bin/bash
# Robust dev server launcher — fully detaches from the calling shell
# so the server survives after the Bash tool command returns.
cd /home/z/my-project

# Kill any existing dev servers
pkill -9 -f "next-server" 2>/dev/null
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "bun.*next" 2>/dev/null
sleep 2

# Clear potentially corrupt cache
rm -rf .next

# Start the dev server as a fully detached daemon
# Double-fork pattern: parent exits, child reparents to init, grandchild is the server
nohup bash -c '
  exec bun next dev -p 3000 --hostname 0.0.0.0
' > /home/z/my-project/dev.log 2>&1 &

# Wait for the server to be ready
for i in $(seq 1 30); do
  if curl -s -o /dev/null --max-time 1 http://localhost:3000 2>/dev/null; then
    echo "Server is ready (attempt $i)"
    exit 0
  fi
  sleep 1
done
echo "Server failed to start in 30s"
exit 1
