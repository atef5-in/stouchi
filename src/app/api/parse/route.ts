import { NextRequest, NextResponse } from "next/server";
import { buildParseSystemPrompt } from "@/lib/parsePrompt";
import type { ParsedTransaction } from "@/lib/types";

// POST { text: string, categories: string[] } -> ParsedTransaction
// Calls LiteLLM (OpenAI-compatible) to parse a casual money note into structured JSON.
// Falls back to direct Anthropic if LITELLM_BASE_URL is not set.
export async function POST(req: NextRequest) {
  try {
    const { text, categories = [] } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const today = new Date().toISOString().slice(0, 10);
    const system = buildParseSystemPrompt(categories as string[], today);

    const baseURL = process.env.LITELLM_BASE_URL ?? "https://api.anthropic.com/v1";
    const apiKey  = process.env.LITELLM_API_KEY  ?? process.env.ANTHROPIC_API_KEY ?? "";
    const model   = process.env.LITELLM_MODEL    ?? "claude-haiku-4-5-20251001";

    const res = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        max_tokens: 256,
        messages: [
          { role: "system", content: system },
          { role: "user",   content: text },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("LiteLLM error", res.status, err);
      return NextResponse.json({ error: "Parse failed" }, { status: 500 });
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
    const parsed = JSON.parse(cleaned) as ParsedTransaction;

    parsed.confidence = Math.max(0, Math.min(1, parsed.confidence ?? 0.8));
    parsed.currency = "TND";
    parsed.needsCategoryConfirmation = Boolean(parsed.needsCategoryConfirmation);
    if (!parsed.date) parsed.date = today;

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("parse error", err);
    return NextResponse.json({ error: "Parse failed" }, { status: 500 });
  }
}
