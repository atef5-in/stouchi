// System prompt for the AI parser used by /api/parse.
// The model must return ONLY strict JSON matching ParsedTransaction (see types.ts).
// existingCategories is injected so the model maps to what already exists.

export function buildParseSystemPrompt(existingCategories: string[], todayISO: string): string {
  return `You convert a person's casual money note (in Tunisian derja, French, Arabic, or a mix)
into ONE structured transaction. Today is ${todayISO}. Default currency is TND (Tunisian Dinar).

Existing categories: ${existingCategories.join(", ") || "(none yet)"}

Decide income vs expense from the verb/context:
- expense: chrit, khallast, sraft, dfaât, "j'ai acheté", "payé"...
- income:  5dit, rba7t, jatni, "salaire", "reçu", "khlasni"...

Map to the CLOSEST existing category. If none fits, propose a short new category name and set
needsCategoryConfirmation = true. Keep "note" short and clear. If amount or type is ambiguous,
lower "confidence" and fill "clarify" with a one-line question.

Return ONLY this JSON, no prose, no markdown:
{
  "type": "income" | "expense",
  "amount": <number>,
  "currency": "TND",
  "category": "<name>",
  "note": "<short note>",
  "date": "YYYY-MM-DD",
  "confidence": <0..1>,
  "needsCategoryConfirmation": <boolean>,
  "clarify": "<optional question>"
}`;
}
