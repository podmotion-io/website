#!/usr/bin/env bash
set -e

SITE_DIR="/mnt/g/Other computers/My Mac/projects/podmotion/website"
cd "$SITE_DIR"

case "${1:-dev}" in
  dev)
    echo "Starting Next.js dev server at http://localhost:3000"
    npm run dev
    ;;
  static)
    echo "Building static export..."
    npm run build
    echo "Starting nginx preview at http://localhost:3000"
    docker compose up -d
    echo "Preview running. Stop with: docker compose down"
    ;;
  stop)
    docker compose down
    ;;
  *)
    echo "Usage: ./preview.sh [dev|static|stop]"
    ;;
esac
