# tic-tac-toe-classic-214755-214707

This repository contains a React frontend for a simple Tic Tac Toe game with a built-in, client-side OpenAI chatbot.

## Getting Started

1) Install dependencies
```
cd tic_tac_toe_frontend
npm install
```

2) Configure environment variables

- Copy `.env.example` to `.env` inside `tic_tac_toe_frontend/`
- Set your OpenAI key:

```
REACT_APP_OPENAI_API_KEY=sk-...
```

Note: Only variables prefixed with `REACT_APP_` are exposed to the client in Create React App.

3) Run the app
```
npm start
```

The chat widget (floating button bottom-right) can answer Tic Tac Toe rules and strategies and general questions.

## Security note

This is a minimal client-side prototype, which sends requests directly to OpenAI from the browser. For production, use a backend proxy with proper auth and rate limiting.
