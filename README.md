# PortraCV

PortraCV is a React + Vite app for ID photo workflows. It helps small photo or printing shops crop portraits, remove backgrounds, stage multiple jobs on one A4 sheet, and print clean passport or ID layouts faster.

## What It Does

- Upload and crop a portrait before processing
- Remove backgrounds for ID photos
- Apply white, transparent, or custom background colors
- Stage multiple people on a single print sheet
- Print preset layouts like `2x2`, `1x1`, and `35x45mm`
- Gate editing tools behind Supabase auth
- Show a small in-app assistant powered by Gemini, with OpenAI fallback

## Stack

- Frontend: React 19, Vite, Tailwind CSS
- Auth: Supabase
- Image editing: `react-easy-crop`, Canvas API
- AI background removal: FastAPI + BiRefNet in [`backend/`](/C:/Users/dheyn/Documents/02_Dev/portraCV/backend)

## Project Structure

- [`src/components/`](/C:/Users/dheyn/Documents/02_Dev/portraCV/src/components) UI and feature components
- [`src/context/AuthContext.jsx`](/C:/Users/dheyn/Documents/02_Dev/portraCV/src/context/AuthContext.jsx) auth/session handling
- [`src/utils/imageProcessor.js`](/C:/Users/dheyn/Documents/02_Dev/portraCV/src/utils/imageProcessor.js) crop + background-removal requests
- [`src/constants/packages.js`](/C:/Users/dheyn/Documents/02_Dev/portraCV/src/constants/packages.js) print layout presets
- [`backend/main.py`](/C:/Users/dheyn/Documents/02_Dev/portraCV/backend/main.py) Python API for background removal

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

Notes:

- `VITE_OPENAI_API_KEY` is optional and is only used as a fallback in the chat widget.
- The frontend currently points to a hosted background-removal API in [`src/constants/packages.js`](/C:/Users/dheyn/Documents/02_Dev/portraCV/src/constants/packages.js).

## Backend

The frontend can work with the hosted API as-is, but the repo also includes the FastAPI service used for background removal.

Install backend dependencies:

```bash
cd backend
pip install -r requirements.txt
python main.py
```

If you run your own backend, update `BACKEND_URL` in [`src/constants/packages.js`](/C:/Users/dheyn/Documents/02_Dev/portraCV/src/constants/packages.js).

## Current Notes

- Protected pages require a valid Supabase session.
- Password recovery and account deletion rely on Supabase auth/RPC setup.
- The app includes an upcoming "AI Formal Attire" feature in the UI, but it is not active yet.
