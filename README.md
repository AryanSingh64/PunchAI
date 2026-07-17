# 🐷 Punch AI — Study Smarter, Not Harder

A high-fidelity, minimalist study workspace that transforms free-form notes or complex topics into interactive 3D flashcards and multiple-choice quizzes. Powered by **Google Gemini Flash 2.0** with a silent auto-fallback to **Groq (Llama 3)**.

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd punch-ai
npm run install:all
```

### 2. Configure Local Keys
Create a `.env` file in the `server` directory (copy from `server/.env.example`):
```env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
PORT=3001
```

### 3. Spin Up Development Servers
Open two terminals and run:
```bash
# Terminal 1 — Client Dashboard (Vite)
cd client && npm run dev

# Terminal 2 — API Gateway Server (Express)
cd server && npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🎨 Design & Aesthetic Pillars

Punch AI is designed around visual restraint, vertical visual rhythm, and ease of use:
- **Wallpaper Background**: Deep dark theme (`#0F0F10`) with an extremely soft, low-saturation radial bottom glow.
- **Micro-Grain Texture**: Cards feature a subtle SVG fractal noise overlay to look tactile and custom-built.
- **Color Palette**: Highly contrasted text surfaces utilizing a single, striking pink accent (`#F0699E`) for primary actions.
- **Onboarding Focus**: Hide sidebars and app headers when inputs are active. 100% of the screen weight is dedicated to the centered prompt input box.

---

## ⚙️ How It Works (The Core Loop)

```
[Raw Notes/Topic] ──> [API Server] ──> [Gemini Flash 2.0]
                             │                 │ (Fail/Rate Limit)
                             │                 └──> [Groq Fallback]
                             ▼
                    [Zod Schema Guard] ──> [Interactive Study Deck]
```

1. **Input**: Paste lecture slides, textbook notes, or type a simple topic.
2. **Generation**: Client sends prompt to Express `/api/generate`. Gemini Flash 2.0 generates structured card and quiz JSON.
3. **Fail-Safe Fallback**: If Gemini fails or hits rate limits, the server silently calls Groq (Llama-3.3-70b) to get the deck.
4. **Zod Validation**: Server outputs are verified against Zod schemas on the client. Malformed AI responses are intercepted before the UI renders.
5. **Session Dashboard**: Deck renders instantly. Switch between 3D Flashcards, interactive Quizzes, and retest incorrect answers.

---

## 🛡️ Fail-Safe Matrix

| Scenario | UI/UX Behavior | Back-End Strategy |
| :--- | :--- | :--- |
| **Gemini API Failure** | Completely silent to the user | Server immediately falls back to Groq SDK |
| **Both APIs Fail** | Renders custom error card with retry button | API returns `502 Bad Gateway` status |
| **Malformed AI JSON** | Catches parsing exception, shows preview + retry option | Returns `422 Unprocessable` status |
| **Network Timeout (>15s)** | Request is aborted safely via `AbortController` | Server request closes safely |
| **Rapid Double Submits** | Aborts stale request in-flight to prevent race states | Safe client-side tracking |
| **Stale Page Reloads** | Previous session is saved and reloadable from History | Local history loads from `localStorage` |

---

## 🛠️ Stack & Technologies

| Layer | Technologies | Key Role |
| :--- | :--- | :--- |
| **Client Core** | React 19 + Vite | Rapid frontend component rendering |
| **State Engine** | `useReducer` + `useContext` | Clean session/retest status management |
| **Icons** | Phosphor Icons (Duotone) | Curated, premium graphic accents |
| **API Gateway** | Express.js | Securely calls AI endpoints (hides keys) |
| **Primary AI** | Google Gemini 2.0 Flash | Ultra-fast semantic data extraction |
| **Fallback AI** | Groq Llama 3.3 70b | High-availability fallback model |
| **Validation** | Zod | Safe response schema parsing |
| **Styles** | Vanilla CSS | Custom design tokens and responsive layouts |
