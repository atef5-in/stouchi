import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildParseSystemPrompt } from "@/lib/parsePrompt";
import type { ParsedTransaction } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { text, categories = [] } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      ...(process.env.ANTHROPIC_BASE_URL ? { baseURL: process.env.ANTHROPIC_BASE_URL } : {}),
    });

    const today = new Date().toISOString().slice(0, 10);
    const system = buildParseSystemPrompt(categories as string[], today);

    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      system,
      messages: [{ role: "user", content: text }],
    });

    const raw = msg.content.find((b) => b.type === "text")?.text ?? "";
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
