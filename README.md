# Stouchi 🪙 — *my pocket money*

A dead-simple, mobile-first money tracker. Speak or type in Tunisian / French / Arabic,
the AI turns it into a clean transaction, you confirm, and Stouchi tracks your balance.

> Example: say *"chrit 9 kilo tmamtem b 150 dinar"* → Stouchi logs a **150 TND** expense in
> **Groceries** and asks you to confirm.

## Stack
Next.js (App Router) · TypeScript · Tailwind · Web Speech API · Claude (parsing) · localStorage · PWA · Vercel

## This is a skeleton
Files are intentionally stubbed. Read **`CLAUDE.md`** — it is the full spec.
Then, in Claude Code, run the `/goal` command (see below) to build the MVP.

## Build the MVP (Claude Code)
```
/goal Build Stouchi to a working MVP and deploy it live on Vercel. Follow CLAUDE.md exactly.
```

## Run locally
```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

## Deploy
Push to GitHub → import in Vercel → set `ANTHROPIC_API_KEY` → deploy.
