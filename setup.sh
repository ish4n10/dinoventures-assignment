#!/usr/bin/env bash
# needs: psql, DATABASE_URL in .env
# What it does:
#   1 Loads DATABASE_URL from .env
#   2  Waits until Postgres is reachable
#   3  Runs seed.sql to insert pre-seed data
#
# Usage:
#   chmod +x setup.sh
#   ./setup.sh


set -euo pipefail

# Load .env 
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
    echo " Loaded environment from .env"
else    
    echo ".env file not found...need DATABASE_URL."
fi

if [ -z "${DATABASE_URL:-}" ]; then
    echo "DATABASE_URL is not set"
    exit 1
fi

echo "Waiting for Postgres to be ready..."
MAX_RETRIES=30
RETRY=0

until psql "$DATABASE_URL" -c '\q' 2>/dev/null; do
    RETRY=$((RETRY + 1))
    if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
        echo "Could not connect to Postgres after ${MAX_RETRIES} attempts. Aborting."
        exit 1
    fi
    echo "Attempt $RETRY/$MAX_RETRIES – retrying in 2 s..."
    sleep 2
done

echo "Postgres is ready."

# The TypeORM will create tables for us
echo "Running TypeORM schema sync (starting app for 5 s)..."
npm run dev &
APP_PID=$!
sleep 5
kill "$APP_PID" 2>/dev/null || true
wait "$APP_PID" 2>/dev/null || true
echo "Schema sync complete."

# Run seed.sql 
echo "Seeding database..."
psql "$DATABASE_URL" -f seed.sql
echo "Seed data inserted successfully."

echo ""
echo "DinoVentures setup complete! Run 'npm run dev' to start the server."
