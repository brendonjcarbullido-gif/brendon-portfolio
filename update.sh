#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "==> Pulling latest changes..."
git pull

echo "==> Rebuilding Docker image..."
docker compose build

echo "==> Restarting container..."
docker compose up -d

echo "==> Done! Portfolio is live at http://portfolio.itachi.home"
