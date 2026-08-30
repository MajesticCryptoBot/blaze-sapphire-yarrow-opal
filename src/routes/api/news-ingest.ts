import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

const CHANNEL = (process.env.TELEGRAM_CHANNEL_USERNAME || "AlphaSignalsPro").trim().replace(/^@/, "").replace(/^https?:\/\/t\.me\//i, "").replace(/\/$/, "");
const MAX_PHOTO_BASE64 = 4_000_000;
const DAY_MS = 24 * 60 * 60 * 1000;

function normalizeChannel(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/t\.me\//i, "")
    .replace(/^t\.me\//i, "")
    .replace(/\/$/, "")
    .toLowerCase();
}

function sameSecret(request: Request): boolean {
  const configured = process.env.WEBSITE_INGEST_SECRET?.trim();
  if (!configured) return false;
  const supplied = request.headers.get("x-website-ingest-secret")?.trim();
  return Boolean(supplied) && supplied === configured;
}

export const Route = createFileRoute("/api/news-ingest")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!sameSecret(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        let body: {
          messageId?: number | string;
          text?: string;
          publishedAt?: string;
          messageUrl?: string | null;
          channelUsername?: string;
          photoBase64?: string | null;
          photoMimeType?: string | null;
        };

        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const messageId = Number(body.messageId);
        const text = typeof body.text === "string" ? body.text : "";
        const publishedAt = new Date(String(body.publishedAt ?? ""));
        const channel = normalizeChannel(body.channelUsername || CHANNEL);
        const configuredChannel = normalizeChannel(CHANNEL);

        if (!Number.isSafeInteger(messageId) || messageId <= 0) {
          return Response.json({ error: "messageId must be a positive integer" }, { status: 400 });
        }
        if (!channel || channel !== configuredChannel) {
          return Response.json({ error: "Wrong channel", expected: configuredChannel, received: channel }, { status: 403 });
        }
        if (Number.isNaN(publishedAt.getTime())) {
          return Response.json({ error: "Invalid publishedAt" }, { status: 400 });
        }
        const age = Date.now() - publishedAt.getTime();
        if (age > DAY_MS || age < -5 * 60_000) {
          return Response.json({ error: "Post is outside the accepted time window" }, { status: 400 });
        }

        const photoBase64 = body.photoBase64?.trim() || null;
        if (photoBase64 && photoBase64.length > MAX_PHOTO_BASE64) {
          return Response.json({ error: "Photo is too large" }, { status: 413 });
        }

        const sql = await getSql();
        await sql.query(
          `insert into telegram_posts
             (chat_id, message_id, chat_username, chat_title, text, published_at, photo_data, photo_mime_type, message_url, updated_at)
           values ($1, $2, $3, $3, $4, $5, case when $6 is null then null else decode($6, 'base64') end, $7, $8, now())
           on conflict (chat_id, message_id) do update set
             text = excluded.text,
             published_at = excluded.published_at,
             photo_data = coalesce(excluded.photo_data, telegram_posts.photo_data),
             photo_mime_type = coalesce(excluded.photo_mime_type, telegram_posts.photo_mime_type),
             message_url = excluded.message_url,
             updated_at = now()`,
          [
            `@${channel}`,
            messageId,
            channel,
            text,
            publishedAt.toISOString(),
            photoBase64,
            body.photoMimeType || null,
            body.messageUrl || null,
          ],
        );

        await sql.query(`delete from telegram_posts where published_at < now() - interval '24 hours'`);

        return Response.json({ ok: true, messageId });
      },
    },
  },
});
