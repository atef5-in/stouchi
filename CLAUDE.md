# CLAUDE.md — Stouchi 🪙

> **Stouchi** (ستوشي) = Tunisian derja for *"my pocket money"*.
> A dead-simple personal money tracker. The user talks or types in Tunisian/French/Arabic,
> the AI turns it into a clean transaction, the user confirms, done.

This file is the source of truth. Read it fully before writing any code.

---

## 1. The product in one sentence
A mobile-first app where **anyone** logs income & expenses by **speaking or typing naturally**
(e.g. *"chrit 9 kilo tmamtem b 150 dinar"*), the AI parses it into a structured log entry,
the user **confirms**, and the app keeps a running **balance** + a simple **dashboard**.

## 2. Non-negotiable principles
1. **Simplicity over everything.** The target user is *anyone* — non-technical, any age. No jargon, no clutter, no onboarding walls.
2. **One main action.** The home screen is a big input (voice + text). Everything else is secondary.
3. **Confirm before save.** The AI never writes a transaction silently. It proposes → user taps ✅ or edits.
4. **Mobile-first.** Designed for a thumb on a phone. PWA, installable, works offline for reading.
5. **Ship fast.** MVP first, live URL first. No auth, no DB server, no payments for the MVP.

## 3. Target user
Anyone in Tunisia (and beyond) who wants to know *"where did my money go?"* without learning an app.
Language is mixed: Tunisian derja + French + Arabic + numbers. The AI must handle all of it.

## 4. Tech stack (chosen for a ~10-min path to a live server)
- **Next.js (App Router) + TypeScript** — one repo, frontend + API route together.
- **Tailwind CSS** — fast, mobile-first styling.
- **PWA** — installable on phone home screen (`manifest.json` + meta). Later: wrap with Capacitor for app stores.
- **Voice**: browser **Web Speech API** (`SpeechRecognition`). Free, no backend. Lang hint `ar-TN` → fallback `ar-SA` → `fr-FR`. The raw transcript is sent to the AI regardless of recognition language, so imperfect speech-to-text is fine.
- **AI parsing**: a single server route `/api/parse` calls Claude to convert free text → structured JSON. Keep the API key server-side only.
- **Storage (MVP)**: **`localStorage`** on the device. Zero backend, zero signup, instant. (Upgrade path: Supabase free tier for multi-device sync — do NOT add this for the MVP.)
- **Deploy**: **Vercel** free tier. Set `ANTHROPIC_API_KEY` as an env var. Live URL in minutes.

## 5. Core features (build in this order)
1. **Input bar** (voice button + text field) on the home screen.
2. **AI parse** → returns a *proposed* transaction (type, amount, currency, category, note, date).
3. **Confirmation card** → user reviews, can edit any field, taps **Confirm** or **Cancel**.
4. **Categories** — default set provided. If the AI suggests a category that doesn't exist, prompt the user to **add it** (one tap) or pick an existing one.
5. **Balance** — running total (income − expenses), shown big at the top.
6. **Transaction list** — recent logs, grouped by day, with category icon + amount color (green income / red expense).
7. **Dashboard** — totals this month, spend by category (simple bars or a donut), income vs expense.

## 6. The AI parsing contract
Input: a free-text string (from voice or typing).
Output: **strict JSON only**, matching `ParsedTransaction` in `src/lib/types.ts`.

Example:
- **User:** `chrit 9 kilo tmamtem b 150 dinar`  ("I bought 9 kg of tomatoes for 150 dinars")
- **AI returns:**
```json
{
  "type": "expense",
  "amount": 150,
  "currency": "TND",
  "category": "Groceries",
  "note": "9 kg tomatoes",
  "date": "2026-06-28",
  "confidence": 0.95,
  "needsCategoryConfirmation": false
}
```
Rules for the AI prompt (see `src/lib/parsePrompt.ts`):
- Currency defaults to **TND** (Tunisian Dinar). "dinar"/"dt"/"د.ت" → TND. Handle millimes if mentioned.
- Decide **income vs expense** from the verb: *chrit/khallast/sraft/dfaât* → expense; *5dit/rba7t/jatni/salary/khlas* → income.
- Map to the **closest existing category**; if none fits, propose a new short category name and set `needsCategoryConfirmation: true`.
- Keep `note` short and human (translate/normalize lightly, keep the meaning).
- If amount or type is ambiguous, set low `confidence` and a `clarify` message — the UI will ask the user.
- **Output JSON only**, no prose, no markdown fences.

Use **Claude Haiku** for this route (cheap + fast, ideal for the free MVP). Model string lives in `/api/parse/route.ts`.

## 7. Data model
See `src/lib/types.ts` (it is the contract — keep it in sync).
- `Transaction`: id, type, amount, currency, categoryId, note, createdAt.
- `Category`: id, name, icon (emoji), kind (income | expense | both), isDefault.
- Persistence keys in `localStorage`: `stouchi.transactions`, `stouchi.categories`.

## 8. Visual direction (keep it light, do not over-design the MVP)
- Friendly, calm, money-app feel. Big readable numbers. Generous tap targets (min 44px).
- One accent color for the brand (suggestion: a warm Tunisian-flag-adjacent red `#E23A3A` or a calm teal — pick one and stay consistent).
- Income = green, expense = red. Rounded cards, soft shadows.
- RTL-friendly where Arabic appears, but the UI chrome can stay LTR for the MVP.

## 9. Project structure
```
src/
  app/
    layout.tsx          # root layout, PWA meta, fonts
    page.tsx            # home: balance + input + recent list
    globals.css         # tailwind + base styles
    api/parse/route.ts  # POST: { text } -> ParsedTransaction (calls Claude)
  components/
    VoiceInput.tsx      # mic button using Web Speech API
    TextInput.tsx       # text field + submit
    ConfirmLog.tsx      # confirmation card (edit + confirm/cancel)
    BalanceCard.tsx     # big running balance
    TransactionList.tsx # grouped recent transactions
    CategoryList.tsx    # manage / pick categories
    AddCategoryModal.tsx# create a new category
  lib/
    types.ts            # all shared types (the contract)
    storage.ts          # localStorage CRUD
    categories.ts       # default categories
    parsePrompt.ts      # system prompt for the AI parser
  hooks/
    useTransactions.ts  # state + persistence for transactions/categories
    useSpeech.ts        # Web Speech API wrapper
```

## 10. Conventions
- TypeScript strict. No `any` in shared types.
- Components are small and presentational; state lives in hooks.
- Currency formatting: a single `formatTND(amount)` helper (3 decimals → millimes optional).
- Dates stored as ISO strings; display as friendly local dates.
- Keep accessibility basics: labels on inputs, aria on the mic button.

## 11. Definition of "MVP done"
- [ ] Runs locally (`npm run dev`) with no errors.
- [ ] User can speak OR type a transaction, see a parsed confirmation card, edit it, and save.
- [ ] Unknown category → prompted to add it.
- [ ] Balance updates; recent transactions list updates; data persists across reloads.
- [ ] Dashboard shows month totals + spend by category.
- [ ] Installable as a PWA on a phone.
- [ ] **Deployed live on Vercel** with `ANTHROPIC_API_KEY` set, and the public URL is reported back.

## 12. Do NOT (for the MVP)
- No auth / login / accounts.
- No external database (localStorage only).
- No payments, no multi-currency complexity beyond TND default.
- No native build / app store submission (PWA is the MVP).
- Don't over-engineer the dashboard — one clear view is enough.
