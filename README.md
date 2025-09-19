# Ultimate Intimacy World

**Private, self-hosted, mobile-first** intimacy portal for exactly two users.

- Single URL via Caddy reverse proxy
- Modules: appointments, private chat, gallery, kinks explorer, fantasy journal, scene builder, positions, stories, toy control (stubs), judgment‑free AI space
- One‑command deploy: `docker compose up -d`

> Generated: 2025-09-18T20:08:37.814696 UTC

## Quick Start

1. Install Docker + Docker Compose.
2. Download this repo ZIP and extract, or clone from your own fork.
3. Copy `.env.example` to `.env` and fill **all** secrets and two user emails/names.
4. Set DNS for `APP_DOMAIN` to your server IP.
5. Start: `docker compose up -d`.
6. First launch will auto-seed **exactly two users** and create the S3 bucket in MinIO.

### Default Routes (all under single domain)

- `/` – login and dashboards (role‑based “Hello Gorgeous” etc.).
- `/api/*` – app backend (Express gateway).
- `/chat` – VoceChat proxied under the same domain.
- `/llm` – OpenWebUI proxied; used internally by the app for NSFW‑friendly LLM.
- `/tts` – Local Piper TTS HTTP endpoint, used by Stories “Read to me”.
- Everything else – Next.js UI.

## Services

- **Caddy** reverse proxy with path routing and HTTPS (Let’s Encrypt).
- **Next.js** web (mobile‑first, warm pastel theme, consent/blur overlays).
- **Gateway** (Node/Express + PostgreSQL) for auth, media, APIs, toys, LLM/RedGifs bridges.
- **PostgreSQL** for all app data.
- **MinIO (S3)** for media storage.
- **VoceChat** for 1:1 private chat (proxied at `/chat`). Set to invite‑only.
- **OpenWebUI + Ollama** for on‑device LLMs (configure model in `.env`).
- **Piper (HTTP)** for local TTS used by Stories.

## Security Checklist

- Replace **all** secrets in `.env`; rotate regularly.
- Configure Caddy for TLS and HSTS.
- Registration is disabled; seeder only creates two users from `.env`.
- All explicit media uses click‑to‑reveal with blurred previews.

## API & Integrations (overview)

- **Lovense developer APIs** for future toy control (Basic/Standard, tokens required).
- **Buttplug/Intiface** optional pathway for direct Bluetooth control from browser/client.
- **RedGifs** API for classy positions/GIF browsing (requires OAuth token).
- **OpenWebUI/Ollama** used for NSFW scene/story generation (runs locally).
- **Piper (HTTP)** for “Read to me”.

See `docs/INTEGRATIONS.md` for endpoints and keys.

## Dev notes

- Web: Next.js 14 + TypeScript. No external SaaS.
- Backend: Express + JWT. Simple PG queries.
- Styling: CSS variables for warm pastel theme, rounded corners, soft shadows, motion.
- Mobile‑first; desktop responsive.

## Test Plan

- Login as both users, verify role‑based dashboard text and tabs.
- Appointments: create/edit/delete.
- Gallery: upload, blur‑reveal, permissions per user.
- Kinks: quiz, save selections; scene builder uses those tags.
- Stories: generate using `/llm` model; “Read to me” uses `/tts` voice.
- Positions: browse RedGifs by tag (if keys set); otherwise demo mode placeholders.
- Chat: VoceChat under `/chat`, invite‑only, only two accounts.
- Toys: configure Lovense token (if available) and hit test endpoints.

## One-Click Install

1) Download the ZIP, extract.  
2) Run `./setup.sh` and answer a few prompts (domain optional).  
3) The script generates secure secrets and two user accounts automatically, then starts Docker and seeds the DB.  
4) Open the site. The **first-run wizard** will:  
   - Check health of Postgres, MinIO, Caddy, LLM, TTS, Chat.  
   - Confirm the two account emails.  
   - Let you pick a default LLM model.  
   - Explain DNS/HTTPS if your domain isn’t set yet.  
5) Land on your warm, loving, two-person portal.

### No hand-editing
All configuration is guided by CLI prompts and the web onboarding screens. Update API keys and model any time in **Admin**.

### Troubleshooting
- **No HTTPS yet:** Set `APP_DOMAIN` when ready, add an A record, then `docker compose restart proxy`.
- **Model not found:** Use the Admin page to set a model string that exists in Ollama, or pull one: `docker exec -it uiw_ollama ollama pull llama3.1:8b-instruct`.
- **Media writes fail:** Ensure the `minio_data` volume has free space and the bucket `uiw-media` exists.
- **Firewall:** Open 80/443 for the proxy, block others from WAN.

## Zero Hand-Editing, Guided UX Guarantee

- **No shell editing after download.** `./setup.sh` asks for minimal inputs, generates strong secrets, and launches.
- **Web onboarding** blocks until critical services are healthy, with loving, step-by-step fixes.
- **Admin** lets you change emails, default model, and API keys anytime.
- **Demo mode**: Every module works without keys and explains how to upgrade to full richness.
- **Health checks**: VoceChat, OpenWebUI, Ollama, MinIO (with write test), Postgres, TTS, proxy, and HTTPS/DNS.
- **HTTPS help**: If `APP_DOMAIN` or certs are missing, the UI shows what DNS records to add and when to restart proxy.

If a required service fails to start, onboarding will **stop** and show the reason, rather than proceeding silently.

## Luxury Experience (Optional but Delightful)

- **Personalized Welcome**: Each partner can write or record a “why this space” message, saved privately.
- **First-use Prompts**: Gentle, loving questions to spark connection.
- **Guided Tour**: Friendly hints on the first visit to each module.
- **Avatar Guide**: Gender-neutral assistant who can speak tips using the browser’s speech engine.
- **Theme Packs**: Soft Blush, Cozy Winter, Sultry Velvet, and Dark Romance; toggle background music.
- **Seasonal & Anniversary**: Banners and greetings on your special days.
- **Gratitude & Feedback**: Leave kind notes and track shared milestones.
- **Backups**: Download a zip of your data from Admin. Optional SMTP health notifications.

These are fully self-contained and configurable from the Admin page, no file editing needed.
