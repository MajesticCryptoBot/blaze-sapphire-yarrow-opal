import { getSql } from "@/lib/db";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
export const GROQ_TRANSLATION_MODEL = "openai/gpt-oss-120b";

function getGroqKey() {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) throw new Error("GROQ_API_KEY is not configured");
  return key;
}

function cleanTranslation(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.replace(/\r\n/g, "\n").trim();
  return text || null;
}

export async function translateNewsToFrench(text: string): Promise<string> {
  const source = text.trim();
  if (!source) return "";

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getGroqKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_TRANSLATION_MODEL?.trim() || GROQ_TRANSLATION_MODEL,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are the French-language editor for a serious financial news desk. Translate the supplied English news brief into natural, professional French. Preserve the exact meaning, facts, figures, percentages, dates, tickers, company names, product names, URLs, and proper nouns. Do not add context, commentary, explanations, or facts. Keep the same paragraph/line structure as the source. Do not translate ticker symbols, brand names, or proper names unless there is a standard French form. Return only JSON with one string field named text.",
        },
        {
          role: "user",
          content: JSON.stringify({ text: source }),
        },
      ],
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Groq translation failed (${response.status})${detail ? `: ${detail.slice(0, 300)}` : ""}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq translation returned no content");

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Groq translation returned invalid JSON");
  }

  const translated = cleanTranslation((parsed as { text?: unknown })?.text);
  if (!translated) throw new Error("Groq translation returned empty text");
  return translated;
}

export async function translateAndStoreNews(messageId: number, text: string): Promise<string> {
  const translated = await translateNewsToFrench(text);
  const sql = await getSql();
  await sql.query(
    `update telegram_posts
        set fr_text = $1,
            updated_at = CURRENT_TIMESTAMP
      where message_id = $2
        and lower(replace(coalesce(chat_username, ''), '@', '')) = 'alphasignalspro'`,
    [translated, messageId],
  );
  return translated;
}
