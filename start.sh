#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

cleanup() {
    echo ""
    echo "Stopping services..."
    kill $(jobs -p) 2>/dev/null
    wait 2>/dev/null
    echo "All services stopped."
}
trap cleanup EXIT INT TERM

# Backend
echo "Starting backend..."
cd "$BACKEND_DIR"
if [ ! -d ".venv" ]; then
    echo "Installing backend dependencies..."
    python3 -m venv .venv
    .venv/bin/pip install -e .
fi
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Frontend
echo "Starting frontend..."
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!

echo ""
echo "======================================"
echo "  OpenTitrator is running!"
echo "======================================"
echo "  Frontend:  http://localhost:5173"
echo "  Backend:   http://localhost:8000"
echo "  API Docs:  http://localhost:8000/docs"
echo "======================================"
echo ""
echo "Press Ctrl+C to stop all services."

wait
