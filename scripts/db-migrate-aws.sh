#!/bin/bash
set -e

# For migrations, connect directly to Aurora with password auth.
# The app uses IAM auth for connections.
# Temporarily add a security group rule allowing your IP on port 5432,
# then run: pnpm db:aws push
# After migration, remove the inbound rule.

ENDPOINT="${AURORA_ENDPOINT:-reachy-outreach-instance-1.c3mwcusiihpb.ap-south-1.rds.amazonaws.com}"
PASSWORD="${AURORA_PASSWORD:-}"
DATABASE="${AURORA_DATABASE:-reachy_outreach}"

if [ -z "$PASSWORD" ]; then
  echo "Error: AURORA_PASSWORD env var is required for migrations"
  echo "Usage: AURORA_PASSWORD=yourpass pnpm db:aws push"
  exit 1
fi

DATABASE_URL="postgres://postgres:${PASSWORD}@${ENDPOINT}:5432/${DATABASE}?sslmode=require" \
  npx drizzle-kit "$@"
