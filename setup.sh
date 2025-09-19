#!/usr/bin/env bash
set -euo pipefail

# Ultimate Intimacy World - One-Click Setup
# Requirements: Docker + Docker Compose, openssl
# Usage: ./setup.sh

red() { printf "\033[31m%s\033[0m\n" "$*"; }
green() { printf "\033[32m%s\033[0m\n" "$*"; }
yellow() { printf "\033[33m%s\033[0m\n" "$*"; }
bold() { printf "\033[1m%s\033[0m\n" "$*"; }

need() {
  command -v "$1" >/dev/null 2>&1 || { red "Missing required command: $1"; exit 1; }
}

gen_secret() { openssl rand -base64 48 | tr -d '\n' ; }
gen_pw() { openssl rand -base64 36 | tr -dc 'A-Za-z0-9' | head -c 28 ; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

need docker
need openssl

bold "Ultimate Intimacy World – One-Click Setup"

if [ ! -f "$ENV_FILE" ]; then
  yellow "No .env found. Generating a secure one for you..."
  APP_DOMAIN_DEFAULT=""
  read -rp "Enter your domain for HTTPS (leave blank to set later): " APP_DOMAIN_INPUT
  APP_DOMAIN="${APP_DOMAIN_INPUT:-$APP_DOMAIN_DEFAULT}"

  read -rp "Enter email for User One (partner) [leave blank to auto-generate]: " USER_ONE_EMAIL
  read -rp "Enter email for User Two (you) [leave blank to auto-generate]: " USER_TWO_EMAIL

  USER_ONE_EMAIL="${USER_ONE_EMAIL:-uiw_user_one+$(date +%s)@example.local}"
  USER_TWO_EMAIL="${USER_TWO_EMAIL:-uiw_user_two+$(date +%s)@example.local}"

  USER_ONE_PASSWORD="$(gen_pw)"
  USER_TWO_PASSWORD="$(gen_pw)"

  POSTGRES_PASSWORD="$(gen_pw)"
  JWT_SECRET="$(gen_secret)"
  MINIO_ROOT_PASSWORD="$(gen_pw)"

  cat > "$ENV_FILE" <<EOF
APP_DOMAIN=${APP_DOMAIN}
APP_PROTOCOL=\${APP_DOMAIN:+https}

POSTGRES_USER=uiw_app
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=uiw
DATABASE_URL=postgresql://uiw_app:${POSTGRES_PASSWORD}@db:5432/uiw

JWT_SECRET=${JWT_SECRET}

MINIO_ROOT_USER=uiw_minio_admin
MINIO_ROOT_PASSWORD=${MINIO_ROOT_PASSWORD}
S3_ENDPOINT=http://minio:9000
S3_BUCKET=uiw-media
S3_ACCESS_KEY=\${MINIO_ROOT_USER}
S3_SECRET_KEY=\${MINIO_ROOT_PASSWORD}
S3_REGION=us-east-1

USER_ONE_EMAIL=${USER_ONE_EMAIL}
USER_ONE_NAME=Gorgeous
USER_ONE_ROLE=her
USER_ONE_GREETING=Hello Gorgeous
USER_ONE_PASSWORD=${USER_ONE_PASSWORD}

USER_TWO_EMAIL=${USER_TWO_EMAIL}
USER_TWO_NAME=Handsome
USER_TWO_ROLE=him
USER_TWO_GREETING=Hey Handsome
USER_TWO_PASSWORD=${USER_TWO_PASSWORD}

REDGIFS_CLIENT_ID=
REDGIFS_CLIENT_SECRET=

LOVENSE_APP_DOMAIN=https://api.lovense.com
LOVENSE_DEVELOPER_TOKEN=

OPENWEBUI_BASE=http://openwebui:8080
OLLAMA_BASE=http://ollama:11434
DEFAULT_MODEL=llama3.1:8b-instruct

TTS_HTTP=http://tts:5000
DEFAULT_TTS_VOICE=en_US-lessac-medium

# Onboarding flags
UIW_FIRST_RUN=true
EOF

  green "Created .env with secure random secrets."
  yellow "User One: ${USER_ONE_EMAIL}  (password saved in .env)"
  yellow "User Two: ${USER_TWO_EMAIL}  (password saved in .env)"
else
  green ".env already exists. Will use existing configuration."
fi

bold "Pulling and starting containers..."
docker compose pull || true
docker compose up -d

bold "Initializing database (creating extensions if needed) ..."
# create extension if missing on alpine images
docker exec -i uiw_db sh -lc "psql -U \"$POSTGRES_USER\" -d \"$POSTGRES_DB\" -c 'CREATE EXTENSION IF NOT EXISTS pgcrypto;'" || true

bold "Seeding your two user accounts..."
docker exec -it uiw_gateway node src/seed.js || true

green "All services launched."

if [ -s "$ENV_FILE" ]; then
  source "$ENV_FILE"
fi

if [ -n "${APP_DOMAIN:-}" ]; then
  green "Visit: https://${APP_DOMAIN}/  (first-run wizard will guide you)."
else
  yellow "No domain provided yet."
  yellow "You can still access over http://<server-ip>/ for local testing."
  yellow "For HTTPS, set DNS A record to this server, update APP_DOMAIN in .env, then 'docker compose restart proxy'."
fi

bold "Done. Love on 🩷"
