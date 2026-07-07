# PortraCV

PortraCV is a React + Vite app for ID photo workflows. It helps small photo or printing shops crop portraits, remove backgrounds, stage multiple jobs on one A4 sheet, and print clean passport or ID layouts faster.

## What It Does

- Upload and crop a portrait before processing
- Remove backgrounds for ID photos using BiRefNet AI
- Apply white, transparent, or custom background colors
- Stage multiple people on a single print sheet
- Print preset layouts like `2x2`, `1x1`, and `35x45mm`
- Gate editing tools behind Supabase auth
- In-app AI assistant powered by Gemini with enforced topic guardrails

## Stack

- Frontend: React 19, Vite, Tailwind CSS
- Auth: Supabase
- Image editing: `react-easy-crop`, Canvas API
- AI background removal: FastAPI + BiRefNet in [`backend/`](./backend)
- AI chat assistant: Google Gemini (`gemini-1.5-flash`)

## Project Structure

- [`src/components/ChatWidget.jsx`](./src/components/ChatWidget.jsx) — AI chat assistant UI
- [`src/constants/chatSystemPrompt.js`](./src/constants/chatSystemPrompt.js) — Full PortraCV knowledge base injected as Gemini system prompt
- [`src/constants/chatSafetySettings.js`](./src/constants/chatSafetySettings.js) — Gemini harm category safety configuration
- [`src/utils/chatGuardrails.js`](./src/utils/chatGuardrails.js) — Client-side jailbreak and off-topic filter
- [`src/components/`](./src/components) — All UI and feature components
- [`src/context/AuthContext.jsx`](./src/context/AuthContext.jsx) — Auth/session handling
- [`src/utils/imageProcessor.js`](./src/utils/imageProcessor.js) — Crop + background-removal requests
- [`src/constants/packages.js`](./src/constants/packages.js) — Print layout presets
- [`backend/main.py`](./backend/main.py) — Python API for background removal

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ Never commit your `.env` file. It is listed in `.gitignore`.

## AI Chat Assistant — Guardrails Architecture

The in-app assistant uses a **three-layer defense** to stay on-topic:

| Layer | Where | What it does |
|-------|-------|-------------|
| 1. Client-side filter | `chatGuardrails.js` | Catches jailbreak attempts and off-topic keywords before the API call |
| 2. System prompt | `chatSystemPrompt.js` | Tells Gemini it can only discuss PortraCV; includes product knowledge and deflection scripts |
| 3. Gemini safety settings | `chatSafetySettings.js` | Blocks harassment, hate speech, explicit content, and dangerous content at the model level |

## Backend

The frontend can work with the hosted API as-is, but the repo also includes the FastAPI service used for background removal.

Install backend dependencies:

```bash
cd backend
pip install -r requirements.txt
python main.py
```

If you run your own backend, update `BACKEND_URL` in [`src/constants/packages.js`](./src/constants/packages.js).

## Current Notes

- Protected pages require a valid Supabase session.
- Password recovery and account deletion rely on Supabase auth/RPC setup.
- The app includes an upcoming "AI Formal Attire" feature in the UI, but it is not active yet.
- The chat assistant deliberately refuses all queries outside of PortraCV topics.
