import { createHash, timingSafeEqual } from "node:crypto";
import { getSql } from "../../src/lib/db";

const CHANNEL = "alphasignalspro";
const MAX_PHOTO_BYTES = 2_500_000;

function authorized(request: Request) {
  const expected = process.env.WEBSITE_INGEST_SECRET?.trim();
  const supplied = request.headers.get("x-website-ingest-secret");
  if (!expected || !supplied) return false;
  const a = createHash("sha256").update(supplied).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

function normalizeChannel(value: unknown) {
  return String(value ?? "").replace(/^@/, "").toLowerCase();
}

function decodePhoto(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  const match = value.match(/^data:([^;]+);base64,(.+)$/s);
  const base64 = match ? match[2] : value;
  const mimeType = match?.[1] ?? "image/jpeg";
  const data = Buffer.from(base64, "base64");
  if (!data.length || data.length > MAX_PHOTO_BYTES) return null;
  return { data, mimeType };
}

export default async function handler(event: { req: Request }) {
  if (!authorized(event.req)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await event.req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = body as {
    channel?: string;
    chatId?: string | number;
    chatUsername?: string;
    chatTitle?: string;
    messageId?: number | string;
    text?: string;
    publishedAt?: string;
    messageUrl?: string;
    photoBase64?: string;
    photoMimeType?: string;
  };

  if (normalizeChannel(payload.channel ?? payload.chatUsername) !== CHANNEL) {
    return Response.json({ error: "Wrong channel" }, { status: 403 });
  }

  const messageId = Number(payload.messageId);
  if (!Number.isSafeInteger(messageId) || messageId <= 0) {
    return Response.json({ error: "Invalid messageId" }, { status: 400 });
  }

  const text = String(payload.text ?? "");
  if (!text.trim()) return Response.json({ error: "Message text is required" }, { status: 400 });

  const published = payload.publishedAt ? new Date(payload.publishedAt) : new Date();
  if (Number.isNaN(published.getTime())) {
    return Response.json({ error: "Invalid publishedAt" }, { status: 400 });
  }

  const photo = decodePhoto(payload.photoBase64);
  if (payload.photoBase64 && !photo) {
    return Response.json({ error: "Photo is missing, invalid, or larger than 2.5 MB" }, { status: 413 });
  }

  const chatId = String(payload.chatId ?? "alphasignalspro");
  const username = String(payload.chatUsername ?? "AlphaSignalsPro");
  const messageUrl = payload.messageUrl || `https://t.me/${CHANNEL}/${messageId}`;
  const sql = await getSql();

  await sql.query(
    `insert into telegram_posts
      (chat_id, message_id, chat_username, chat_title, text, published_at, photo_data, photo_mime_type, message_url, updated_at)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
     on conflict (chat_id, message_id) do update set
       chat_username = excluded.chat_username,
       chat_title = excluded.chat_title,
       text = excluded.text,
       published_at = excluded.published_at,
       photo_data = coalesce(excluded.photo_data, telegram_posts.photo_data),
       photo_mime_type = coalesce(excluded.photo_mime_type, telegram_posts.photo_mime_type),
       message_url = excluded.message_url,
       updated_at = now()`,
    [
      chatId,
      messageId,
      username,
      payload.chatTitle ?? "AlphaSignalsPro",
      text,
      published.toISOString(),
      photo?.data ?? null,
      photo?.mimeType ?? payload.photoMimeType ?? null,
      messageUrl,
    ],
  );

  await sql.query("delete from telegram_posts where published_at < now() - interval '48 hours'");
  return Response.json({ ok: true, messageId });
}
