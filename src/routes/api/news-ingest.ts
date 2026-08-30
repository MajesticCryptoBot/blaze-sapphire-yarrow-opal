import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

// This endpoint is authenticated by WEBSITE_INGEST_SECRET.
// The destination is intentionally fixed here because the only intended
// publisher is the user's local ASP script for AlphaSignalsPro.
const CANONICAL_CHANNEL = "AlphaSignalsPro";
const MAX_PHOTO_BASE64 = 4_000_000;

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

        if (!Number.isSafeInteger(messageId) || messageId <= 0) {
          return Response.json({ error: "messageId must be a positive integer" }, { status: 400 });
        }
        if (Number.isNaN(publishedAt.getTime())) {
          return Response.json({ error: "Invalid publishedAt" }, { status: 400 });
        }

        const photoBase64 = body.photoBase64?.trim() || null;
        if (photoBase64 && photoBase64.length > MAX_PHOTO_BASE64) {
          return Response.json({ error: "Photo is too large" }, { status: 413 });
        }

        // The authenticated publisher is permanently associated with
        // AlphaSignalsPro. Do not validate or trust a caller-supplied channel.
        const channel = CANONICAL_CHANNEL;

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
            body.messageUrl || `https://t.me/${channel}/${messageId}`,
          ],
        );

        // Retention is no longer tied to 24 hours. The public feed simply
        // returns the newest posts, so historical rows can remain in storage.
        return Response.json({ ok: true, messageId });
      },
    },
  },
});
