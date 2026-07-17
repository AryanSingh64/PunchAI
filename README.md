# StudyAI — AI-Powered Flashcards & Quiz

> Frontend Internship Assignment — Flam

A modern study assistant that transforms any notes or topic into interactive flashcards and a multiple-choice quiz using Google Gemini AI (with Groq as fallback).

---

## Features

- **AI-generated flashcards** from any notes or topic input
- **3D card flip animation** with progress tracking
- **Mark cards** as "Got it" or "Still learning"
- **Multiple-choice quiz** with instant feedback and explanations
- **Automatic wrong-answer retesting** — quiz only the ones you missed
- **Gemini → Groq fallback** — silently switches providers if Gemini fails
- **Full error handling** — malformed JSON, network failures, timeouts, stale requests all handled gracefully
- **Light & Dark mode** — soft lavender light / bold crimson dark
- **Mobile responsive** — bottom nav on mobile, sidebar on desktop
- **API key never in the browser** — all AI calls go through the Express backend

---

## Setup

### Prerequisites
- Node.js 18+
- A [Gemini API key](https://aistudio.google.com) (free)
- A [Groq API key](https://console.groq.com) (free, used as fallback)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd study-assistant

# Install client deps
cd client && npm install

# Install server deps
cd ../server && npm install
```

### 2. Configure Environment

```bash
# In /server — copy and fill in your keys
cp .env.example .env
```

Edit `server/.env`:
```
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
PORT=3001
```

```bash
# In /client
cp .env.example .env
# VITE_API_URL=http://localhost:3001  (already set)
```

### 3. Run

Open **two terminals**:

```bash
# Terminal 1 — Server
cd server && npm run dev

# Terminal 2 — Client
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## How It Works

1. User types or pastes notes/topic in the input panel
2. Client sends `POST /api/generate` to the Express server (never to AI directly)
3. Server builds a structured prompt and calls Gemini Flash 2.0
4. If Gemini fails (rate limit, error), server silently retries with Groq
5. Response JSON is validated with Zod — malformed/wrong-shape responses are caught
6. Client renders the validated data as interactive flashcards and a quiz

### AI Response Shape
```json
{
  "topic": "Mitosis",
  "cards": [{ "id": "card_1", "question": "...", "answer": "...", "explanation": "..." }],
  "quiz":  [{ "id": "q_1", "question": "...", "options": ["A","B","C","D"], "correct": 2, "explanation": "..." }]
}
```

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Malformed JSON from AI | Caught, error UI shown with raw preview + retry |
| Wrong response shape | Zod validation fails → error UI |
| Gemini rate limit / error | Auto-fallback to Groq (silent) |
| Both providers fail | Error state shown to user |
| Network timeout (>15s) | AbortController fires, timeout message shown |
| Rapid repeated submits | Previous request aborted via AbortController |
| Empty response | Handled by Zod min(1) constraints |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React (hooks, functional components) |
| Routing | React Router v6 |
| Styling | Vanilla CSS with CSS custom properties |
| Icons | Phosphor Icons (Duotone weight) |
| Fonts | Plus Jakarta Sans + Inter (Google Fonts) |
| Backend | Express.js |
| AI Primary | Google Gemini Flash 2.0 |
| AI Fallback | Groq llama-3.3-70b-versatile |
| Validation | Zod |
| State | useState + useReducer |

---

## AI Usage Note

I used Claude (Anthropic) as a coding assistant throughout this project for:
- Planning the component architecture and state model
- Generating boilerplate for the Express server and Zod schemas
- Suggesting the error-handling matrix (7 failure scenarios)
- Drafting the CSS design token system

All design decisions, architecture choices, component structure, and prompt engineering were made by me. I understand every line of code and can explain/extend any part of it.

---

## Known Limitations

- No session persistence between page reloads (planned for Phase 2)
- Groq's smaller context window may struggle with very long notes (>3000 chars)
- No streaming — cards appear all at once after generation
- Dark mode card flip background is currently a gradient (not pure Gemini-style animation)
- No audio pronunciation for terms

---

## Time Spent

| Phase | Time |
|---|---|
| Planning & design system | ~1.5h |
| Express server + AI integration | ~1h |
| Hooks (useAI, useSession) | ~1.5h |
| Components (Flashcard, Quiz, Results, Error, Loading) | ~2h |
| Landing page | ~1h |
| Polish, bug fixes, CSS responsive | ~1h |
| **Total** | **~8h** |

---

## Project Structure

```
study-assistant/
├── client/src/
│   ├── pages/        Landing.jsx, Study.jsx
│   ├── components/   InputPanel, Flashcard, QuizMode, QuizResults, LoadingState, ErrorState
│   ├── hooks/        useAI.js (fetch + abort + fallback), useSession.js (reducer)
│   ├── lib/          schema.js (Zod), prompts.js
│   └── styles/       index.css (design tokens + all styles)
└── server/
    └── index.js      Express + Gemini + Groq
```
