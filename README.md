# IBM Consulting AI — Bob-a-thon Q&A Assistant

A ChatGPT-style chat interface for IBM Consulting's internal Bob-a-thon hackathon.
Users ask questions about IBM Consulting services and an AI agent responds in real time.

---

## Tech stack

| Tool | Purpose |
|---|---|
| React 19 + Vite | UI framework & dev server |
| Tailwind CSS v4 | Utility-first styling |
| Axios | HTTP requests to the AI backend |

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Changing the API URL

Open [`src/App.jsx`](src/App.jsx) and update the constant at the top of the file:

```js
// ─── API Configuration ──────────────────────────────────────────────────────
const API_URL = 'https://your-real-backend.com/ask';
// ────────────────────────────────────────────────────────────────────────────
```

The API must accept a `POST` request with this body:

```json
{ "question": "string" }
```

And respond with:

```json
{ "answer": "string" }
```

---

## Project structure

```
src/
├── App.jsx                      # Main entry point, state management, API calls
├── index.css                    # Global styles, Tailwind import, animations
└── components/
    ├── ChatWindow.jsx           # Scrollable message list, auto-scroll logic
    ├── MessageBubble.jsx        # Individual message bubble (user / agent / error)
    ├── TypingIndicator.jsx      # Animated 3-dot loading indicator
    ├── SuggestedQuestions.jsx   # Welcome screen shown when chat is empty
    └── InputArea.jsx            # Textarea + Send button, keyboard handling
```

---

## Features

- **Chat interface** — user messages on the right (IBM blue), agent replies on the left (white)
- **Timestamps** on every message
- **Typing indicator** — three bouncing dots while waiting for a response
- **Suggested questions** — shown on the welcome screen when the chat is empty
- **Clear chat** button in the header
- **Error handling** — friendly error message with a **Retry** button if the API fails
- **Keyboard shortcut** — `Enter` to send, `Shift+Enter` for a new line
- **Responsive** — works on mobile and desktop
- **Session persistence** — chat history lives in React state for the duration of the session

---

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Serve with any static host (Nginx, Vercel, IBM Cloud Static Files, etc.).

---

## IBM Consulting topics covered

The AI agent is designed to answer questions about:

- Hybrid Cloud & Data services
- Digital Product Design and Engineering
- AI Integration Services
- Application Modernization
- IBM Consulting Advantage (ICA) platform
