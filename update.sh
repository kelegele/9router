#!/bin/bash
set -e

echo ">>> Pulling latest image..."
docker pull decolua/9router:latest

echo ">>> Restarting 9router..."
docker stop 9router 2>/dev/null || true
docker rm 9router 2>/dev/null || true
docker run -d \
  --name 9router \
  --restart unless-stopped \
  -p 20128:20128 \
  --env-file .env \
  -e TZ=Asia/Shanghai \
  -v 9router-data:/app/data \
  decolua/9router:latest

sleep 3
docker ps --filter name=9router --format '{{.Names}}  {{.Status}}  {{.Ports}}'
echo ">>> Done! http://localhost:20128"
