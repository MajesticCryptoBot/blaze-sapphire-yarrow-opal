import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

// Production diagnostic marker. This lets us prove which source is serving
// /api/news-ingest instead of relying on a generic HTTP status.
const INGEST_VERSION = "ASP-INGEST-V8-20260831";
const CANONICAL_CHANNEL = "AlphaSignalsPro";
const MAX_PHOTO_BASE64 = 4_000_000;

function response(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      "x-asp-ingest-version": INGEST_VERSION,
      "cache-control": "no-store",
    },
  });
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
      GET: async () =>
        response({
          ok: true,
          service: "news-ingest",
          version: INGEST_VERSION,
          channel: CANONICAL_CHANNEL,
        }),

      POST: async ({ request }) => {
        if (!sameSecret(request)) {
          return response({ error: "Unauthorized", version: INGEST_VERSION }, 401);
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
          return response({ error: "Invalid JSON", version: INGEST_VERSION }, 400);
        }

        const messageId = Number(body.messageId);
        const text = typeof body.text === "string" ? body.text : "";
        const publishedAt = new Date(String(body.publishedAt ?? ""));
        const receivedChannel = typeof body.channelUsername === "string"
          ? body.channelUsername.trim().replace(/^@/, "")
          : "";

        if (!Number.isSafeInteger(messageId) || messageId <= 0) {
          return response({ error: "messageId must be a positive integer", version: INGEST_VERSION }, 400);
        }
        if (Number.isNaN(publishedAt.getTime())) {
          return response({ error: "Invalid publishedAt", version: INGEST_VERSION }, 400);
        }

        const photoBase64 = body.photoBase64?.trim() || null;
        if (photoBase64 && photoBase64.length > MAX_PHOTO_BASE64) {
          return response({ error: "Photo is too large", version: INGEST_VERSION }, 413);
        }
        const photoBuffer = photoBase64 ? Buffer.from(photoBase64, "base64") : null;
        const photoMimeType = photoBuffer ? (body.photoMimeType?.trim() || "image/jpeg") : null;

        // The authenticated publisher is permanently associated with
        // AlphaSignalsPro. The caller-supplied channel is diagnostic only.
        const channel = CANONICAL_CHANNEL;

        const sql = await getSql();
        await sql.query(
          `insert into telegram_posts
             (chat_id, message_id, chat_username, chat_title, text, published_at, photo_data, photo_mime_type, message_url, updated_at)
           values ($1, $2, $3, $3, $4, $5::timestamptz, $6::bytea, $7::text, $8::text, now())
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
            photoBuffer,
            photoMimeType,
            body.messageUrl || `https://t.me/${channel}/${messageId}`,
          ],
        );

        return response({
          ok: true,
          messageId,
          version: INGEST_VERSION,
          channel: CANONICAL_CHANNEL,
          receivedChannel,
        });
      },
    },
  },
});
