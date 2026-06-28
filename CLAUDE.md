# CLAUDE.md — Stouchi 🪙

> **Stouchi** (ستوشي) = Tunisian derja for *"my pocket money"*.
> A dead-simple personal money tracker. The user talks or types in Tunisian/French/Arabic,
> the AI turns it into a clean transaction, the user confirms, done.

This file is the source of truth for how the project works. The MVP is **built and deployed**.

---

## 1. Product in one sentence
A mobile-first app where **anyone** logs income & expenses by **speaking or typing naturally**
(e.g. *"chrit 9 kilo tmamtem b 150 dinar"*), the AI parses it into a structured entry,
the user **confirms**, and the app keeps a running **balance** + a simple **dashboard**.

## 2. Non-negotiable principles
1. **Simplicity over everything.** Target user is *anyone* — non-technical, any age. No jargon, no onboarding walls.
2. **One main action.** The home screen is a big input (voice + text). Everything else is secondary.
3. **Confirm before save.** The AI never writes silently — it proposes, the user taps Save or edits.
4. **Mobile-first.** Thumb on a phone. PWA, installable.
5. **Ship fast.** Live URL first. No auth, no DB server for the MVP.

## 3. Tech stack
- **Next.js 15 (App Router) + TypeScript (strict)** — one repo, frontend + API route together.
- **Tailwind CSS 3** — mobile-first styling. Theme tokens live in `tailwind.config.ts`.
- **PWA** — `public/manifest.json` + meta in `src/app/layout.tsx`. Installable on a phone.
- **Voice**: browser **Web Speech API** (`SpeechRecognition`), wrapped in `src/hooks/useSpeech.ts`.
  Lang hint `ar-TN` → fallback `ar-SA` → `fr-FR`. Raw transcript is sent to the AI regardless,
  so imperfect speech-to-text is fine.
- **AI parsing**: server route `src/app/api/parse/route.ts` calls an **OpenAI-compatible
  `/chat/completions` endpoint via `fetch`** (LiteLLM gateway), falling back to Anthropic directly.
  Keys are server-side only. See §6.
- **Storage (MVP)**: **`localStorage`** on the device (`src/lib/storage.ts`). Zero backend, zero signup.
  Upgrade path: Supabase for multi-device sync — NOT in the MVP.
- **Deploy**: **Vercel** free tier. Set env vars (§6).

## 4. ⚠️ Gotcha — Node version
The system default `node` here is **v10**, too old for Next 15 (build/dev throw `Unexpected token ?`).
Use nvm: `nvm use 22` (or any Node ≥18) before `npm run dev` / `npm run build`.

## 5. Core features (all implemented)
1. **Input bar** (voice button + text field) — `src/app/page.tsx`, `VoiceInput.tsx`.
2. **AI parse** → proposed transaction (type, amount, currency, category, note, date).
3. **Confirmation card** → review/edit any field, Save or Discard — `ConfirmLog.tsx`.
4. **Categories** — defaults in `src/lib/categories.ts`. Unknown category → prompt to add — `AddCategoryModal.tsx`.
5. **Balance** — running total, shown in the "wallet" hero — `BalanceCard.tsx`.
6. **Ledger** — recent transactions grouped by day with per-day net — `TransactionList.tsx`.
7. **Dashboard** — month totals + spend-by-category bars — `src/app/dashboard/page.tsx`.

## 6. AI parsing contract
Route: `POST /api/parse` with `{ text: string, categories: string[] }` → `ParsedTransaction` (see `src/lib/types.ts`).
The system prompt is built in `src/lib/parsePrompt.ts`. The route strips ```` ```json ```` fences,
clamps `confidence`, forces `currency: "TND"`, and defaults `date` to today.

**Env vars** (route reads these, in order):
- `LITELLM_BASE_URL` (default `https://api.anthropic.com/v1`)
- `LITELLM_API_KEY` → falls back to `ANTHROPIC_API_KEY`
- `LITELLM_MODEL` (default `claude-haiku-4-5-20251001` — cheap + fast, ideal for the MVP)

Prompt rules (kept in `parsePrompt.ts`): currency defaults to **TND**; verb decides income vs
expense (*chrit/khallast/sraft* → expense; *5dit/rba7t/salary* → income); map to the closest existing
category or propose a new short name with `needsCategoryConfirmation: true`; keep `note` short;
ambiguous → low `confidence` + a `clarify` message. **Output strict JSON only.**

## 7. Data model
See `src/lib/types.ts` (the contract — keep in sync).
- `Transaction`: id, type, amount, currency, categoryId, note, createdAt.
- `Category`: id, name, icon (emoji), kind (income | expense | both), isDefault.
- `localStorage` keys: `stouchi.transactions`, `stouchi.categories`.
- State + persistence: `src/hooks/useTransactions.ts` (exposes balance, income, expense totals).
- Currency formatting: `formatTND()` in `src/lib/format.ts` (3 decimals = millimes, space thousands).

## 8. Visual identity — "Carnet de poche" (a warm Tunisian pocket ledger)
A deliberate, non-generic design system. Defined in `tailwind.config.ts` + `src/app/globals.css`.
- **Palette** (Tailwind tokens): `paper`/`paper-card`/`paper-deep` (warm cream canvas),
  `ink` (warm near-black — text + the "wallet"), `ink-soft`, `line` (hairline borders),
  `clay` (terracotta — brand + expense), `olive` (income), `saffron` (gold accents).
  Income = olive-green, expense = clay-red (semantic colors honored, just with character).
- **Type**: **Fraunces** (optical serif — wordmark + all money figures), **Inter** (UI),
  **IBM Plex Sans Arabic** (Arabic touches). Loaded via `next/font` in `layout.tsx`.
  Use `.font-display` + `.tnum` (tabular nums) on figures.
- **Texture**: faint SVG grain overlay (`.grain` in `globals.css`) + warm vignette on the body.
- **Brand mark**: an engraved gold **coin** stamped with س — `src/components/Coin.tsx`. Reused as logo + accents.
- **Signature element**: the dark-ink "wallet" balance card with a glowing in/out split bar.
- RTL where Arabic appears; UI chrome stays LTR.

## 9. Project structure
```
src/
  app/
    layout.tsx          # root layout, fonts (next/font), PWA meta
    page.tsx            # home: wallet + input + ledger
    globals.css         # tailwind + canvas, grain, animations, type helpers
    dashboard/page.tsx  # month totals + spend by category
    api/parse/route.ts  # POST: { text, categories } -> ParsedTransaction (LiteLLM/Anthropic)
  components/
    Coin.tsx            # brand mark (engraved gold coin SVG)
    BalanceCard.tsx     # the "wallet" hero
    VoiceInput.tsx      # mic button (Web Speech API) with live sound-bars
    ConfirmLog.tsx      # confirmation/edit card
    TransactionList.tsx # ledger, grouped by day
    AddCategoryModal.tsx# create a new category
  lib/
    types.ts            # shared types (the contract)
    storage.ts          # localStorage CRUD
    categories.ts       # default categories
    parsePrompt.ts      # system prompt for the AI parser
    format.ts           # formatTND helper
  hooks/
    useTransactions.ts  # state + persistence
    useSpeech.ts        # Web Speech API wrapper
```

## 10. Conventions
- TypeScript strict. No `any` in shared types.
- Components small/presentational; state lives in hooks.
- Dates stored as ISO strings; displayed as friendly local dates.
- Accessibility basics: labels on inputs, aria on the mic button.
- Dynamic Tailwind classes must be full literal strings (JIT can't see `bg-${x}`).

## 11. Do NOT (for the MVP)
- No auth / login / accounts. No external database (localStorage only).
- No payments, no multi-currency beyond TND default.
- No native build / app store (PWA is the MVP).
- Don't over-engineer the dashboard — one clear view is enough.

## 12. Helper skills
- `start-server` skill (`.claude/skills/start-server/`) — starts the dev server (handles the nvm Node switch).
