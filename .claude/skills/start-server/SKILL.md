---
name: start-server
description: >
  Start the Stouchi Next.js dev server and open the app in the browser.
  Use when the user says "start", "run the app", "start server", or "/start-server".
  Handles everything with zero human intervention.
---

# Start Stouchi

Run every step below in order. Never ask the user to do anything — handle it all.

## Step 1 — Kill any stale process on port 3000

```bash
fuser -k 3000/tcp 2>/dev/null || true
sleep 1
```

## Step 2 — Start the dev server

Use NVM node 20. Start in background, log to `/tmp/stouchi-dev.log`.

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 20 && cd "/home/atef/My projects/stouchi" && npm run dev > /tmp/stouchi-dev.log 2>&1 &
echo "Dev server PID: $!"
```

## Step 3 — Wait for the server to be ready

Poll `http://localhost:3000` every 2 seconds, up to 40 seconds (Next.js needs time to compile on first start).

```bash
for i in $(seq 1 20); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
  if [ "$STATUS" = "200" ] || [ "$STATUS" = "307" ] || [ "$STATUS" = "302" ]; then echo "Server ready."; break; fi
  echo -n "."
  sleep 2
done
```

## Step 4 — Open the browser

```bash
xdg-open http://localhost:3000
```

## Step 5 — Report status

```bash
echo ""
echo "=== Stouchi is running ==="
echo "App  : http://localhost:3000"
echo "Logs : /tmp/stouchi-dev.log"
echo "=========================="
```
