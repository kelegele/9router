#!/bin/bash
set -e

cd "$(dirname "$0")"

echo ">>> Pulling latest code..."
git pull

echo ">>> Rebuilding image..."
docker stop 9router 2>/dev/null || true
docker rm 9router 2>/dev/null || true
docker build -t 9router .

echo ">>> Starting 9router..."
docker run -d \
  --name 9router \
  --restart unless-stopped \
  -p 20128:20128 \
  --env-file .env \
  -v 9router-data:/app/data \
  9router

sleep 3
docker ps --filter name=9router --format '{{.Names}}  {{.Status}}  {{.Ports}}'
echo ">>> Done! http://localhost:20128"
