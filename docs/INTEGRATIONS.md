# Integrations

## LLM (OpenWebUI + Ollama)
- Proxied at `/llm` and used via OpenAI‑compatible `/v1/chat/completions` endpoint.
- Quick start docs: https://docs.openwebui.com/getting-started/quick-start/

## Piper TTS (HTTP)
- Container exposes HTTP on 5000. We call `/api/tts?text=...&voice=...`.
- Image hint: rhasspy/wyoming-piper with HTTP (see Docker Hub readme).

## RedGifs
- Requires OAuth temporary token, then query search endpoints by tag.
- We proxy via `/api/positions/redgifs?tag=romantic` to avoid exposing keys client-side.

## Lovense
- Developer platform supports Basic/Standard APIs and WebSocket/Events.
- Real control requires users to pair via Lovense Remote and grant tokens.
- We keep stubs ready in `/api/toys/lovense/*`.

## Buttplug / Intiface (optional)
- Consider using Intiface Central/Engine for local Bluetooth control via the browser using buttplug-js.
- This may require user devices (phones/PC) rather than the server to own the BT radio.
