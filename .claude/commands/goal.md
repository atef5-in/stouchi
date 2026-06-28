---
description: Drive Stouchi to a working, live MVP autonomously.
---

You are working on **Stouchi**. First, read `CLAUDE.md` in full — it is the source of truth.

## Goal
$ARGUMENTS

## How to operate
Work autonomously, end to end, until the goal is met. Do not stop to ask for confirmation
on routine implementation choices — make a sensible decision, note it, and keep going.

1. **Plan** — list the build order from CLAUDE.md §5 and §11 as a checklist.
2. **Build** — implement each stub file. Replace every `TODO` and placeholder with real code.
3. **Wire the AI** — implement `/api/parse` using `@anthropic-ai/sdk` with the prompt in
   `src/lib/parsePrompt.ts`. Use the Claude **Haiku** model string. Keep the key server-side.
4. **Run & verify locally** — `npm install`, then `npm run dev`. Fix all type/build errors.
   Verify the full flow: input → parse → confirm/edit → save → balance & list update.
5. **Test the key paths** — unknown category prompt, voice input fallback, data persistence
   across reload, dashboard totals.
6. **Deploy** — push to GitHub and deploy to **Vercel**. Set `ANTHROPIC_API_KEY` in the
   Vercel project env. Trigger a production build.
7. **Confirm live** — open the production URL, smoke-test the core flow, and **report the
   public URL** back to the user.

## Guardrails (from CLAUDE.md §12)
- No auth, no external DB (localStorage only), no payments for the MVP.
- Mobile-first PWA. Keep it dead simple.
- Stop and ask the user ONLY if you hit something that needs a secret/credential or a
  decision that can't be reversed (e.g. which Vercel/GitHub account to use).

When finished, output: the live URL, what works, and any follow-ups deferred to post-MVP.
