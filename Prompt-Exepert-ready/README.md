# PromptThink

PromptThink is a Prompt-Thinking Assistant prototype built with React, TypeScript, Tailwind CSS v4, and a shadcn-compatible component structure.

## Run

```bash
npm install
npm run dev
```

## What works locally

- Prompt workspace and chat history
- Prompt analysis with practical statuses
- Minimal clarification questions
- Assumption / contradiction / trade-off detection
- Improved prompt generation using a deterministic local thinking engine
- Copy/apply improved prompt actions
- Folders and chat deletion
- Local in-memory state for the current session
- Responsive layout

The current thinking engine is intentionally local and deterministic so the interface is fully usable without an API key. A production AI service can replace `src/lib/think-engine.ts` behind the same analysis interface.
