# Stouchi 🪙 — *my pocket money*

A dead-simple, mobile-first money tracker. Speak or type in Tunisian / French / Arabic,
the AI turns it into a clean transaction, you confirm, and Stouchi tracks your balance.

> Example: say *"chrit 9 kilo tmamtem b 150 dinar"* → Stouchi proposes a **150 TND** expense in
> **Groceries** and asks you to confirm.

## Features
- 🎙️ **Voice or text input** — say it however you talk (Web Speech API, no backend).
- 🤖 **AI parsing** — free text → structured transaction, you confirm before it saves.
- 🏷️ **Categories** — sensible defaults; unknown ones are proposed and added in one tap.
- 💰 **Running balance** — a warm "wallet" hero with an income/expense split.
- 📒 **Ledger** — recent transactions grouped by day with per-day net.
- 📊 **Dashboard** — month totals + spend-by-category.
- 📱 **PWA** — installable on your phone home screen.

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind · Web Speech API · LiteLLM/Anthropic (parsing) · localStorage · PWA · Vercel

Data lives in `localStorage` (no accounts, no server DB). See **`CLAUDE.md`** for the full spec
and the **"Carnet de poche"** design system.

## Run locally
> ⚠️ Needs **Node ≥ 18** (Next 15 won't run on older Node). If you use nvm: `nvm use 22`.

```bash
npm install
cp .env.example .env.local   # add your API key (see below)
npm run dev
```

## Environment
The parse route (`src/app/api/parse/route.ts`) calls an OpenAI-compatible `/chat/completions`
endpoint, defaulting to Anthropic. Set these in `.env.local` (and in Vercel project settings):

| Var | Default | Notes |
|-----|---------|-------|
| `LITELLM_BASE_URL` | `https://api.anthropic.com/v1` | Point at a LiteLLM gateway to use one. |
| `LITELLM_API_KEY` | falls back to `ANTHROPIC_API_KEY` | Server-side only. |
| `LITELLM_MODEL` | `claude-haiku-4-5-20251001` | Cheap + fast for parsing. |

Minimum to run: set `ANTHROPIC_API_KEY`.

## Deploy
Push to GitHub → import in Vercel → set the env vars above → deploy.
