import { getSql } from "@/lib/db";
import type { NewsTag } from "@/lib/news";

export const TELEGRAM_CHANNEL = "AlphaSignalsPro";
export const TELEGRAM_URL = "https://t.me/AlphaSignalsPro";
const CHANNEL_KEY = "alphasignalspro";

export type TelegramPost = {
  id: number;
  text: string;
  publishedAt: string;
  hasPhoto: boolean;
  messageUrl: string | null;
};

type PostRow = {
  message_id: number | string;
  text: string;
  published_at: string;
  message_url: string | null;
  has_photo: number | boolean;
};

function mapRow(row: PostRow): TelegramPost {
  return {
    id: Number(row.message_id),
    text: row.text,
    publishedAt: new Date(row.published_at).toISOString(),
    hasPhoto: Boolean(row.has_photo),
    messageUrl: row.message_url,
  };
}

export function parsePublicId(slug: string): number | null {
  const raw = slug.replace(/^telegram-/i, "").trim();
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  return id;
}

export function tagFromText(text: string): NewsTag {
  const head = text.trim().toUpperCase();
  if (head.startsWith("JUST IN")) return "JUST IN";
  if (head.startsWith("BREAKING")) return "BREAKING";
  if (head.startsWith("ALERT")) return "ALERT";
  return "NEW";
}

export function categoryFromText(text: string): string {
  const lower = text.toLowerCase();
  if (/\b(fed|fomc|cpi|nfp|treasury|macro|rate[- ]hike|warsh)\b/.test(lower)) return "Macro";
  if (/\b(nvidia|openai|anthropic|ai|gpu|semiconductor)\b/.test(lower)) return "AI";
  if (/\b(stock|equity|nasdaq|s&p|kospi|ipo)\b/.test(lower)) return "Markets";
  return "Crypto";
}

export function splitHeadline(text: string) {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const headline = lines[0] || text.slice(0, 140);
  const dek = lines.slice(1).join(" ");
  return { headline, dek, body: lines.slice(1) };
}

export async function listTelegramPosts(limit = 10): Promise<TelegramPost[]> {
  const sql = await getSql();
  const rows = await sql.query<PostRow>(
    `select message_id, text, published_at, message_url,
            case when photo_file_id is not null or photo_data is not null then 1 else 0 end as has_photo
       from telegram_posts
      where lower(replace(coalesce(chat_username, ''), '@', '')) = $1
      order by published_at desc
      limit $2`,
    [CHANNEL_KEY, Math.min(Math.max(limit, 1), 10)],
  );
  return rows.map(mapRow);
}

export async function getTelegramPost(id: number): Promise<TelegramPost | null> {
  const sql = await getSql();
  const rows = await sql.query<PostRow>(
    `select message_id, text, published_at, message_url,
            case when photo_file_id is not null or photo_data is not null then 1 else 0 end as has_photo
       from telegram_posts
      where lower(replace(coalesce(chat_username, ''), '@', '')) = $1
        and (message_id = $2 or id = $2)
      order by published_at desc
      limit 1`,
    [CHANNEL_KEY, id],
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function getTelegramPhoto(id: number) {
  const sql = await getSql();
  const rows = await sql.query<{ photo_data: Uint8Array | ArrayBuffer | null; photo_mime_type: string | null }>(
    `select photo_data, photo_mime_type
       from telegram_posts
      where (message_id = $1 or id = $1)
        and lower(replace(coalesce(chat_username, ''), '@', '')) = $2
      order by published_at desc
      limit 1`,
    [id, CHANNEL_KEY],
  );
  return rows[0] ?? null;
}
