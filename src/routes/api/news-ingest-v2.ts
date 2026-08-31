import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

// Fresh endpoint intentionally created to bypass any stale /api/news-ingest
// deployment/route artifact. The publisher is authenticated by the shared
// secret; the destination channel is fixed server-side.
const INGEST_VERSION = "ASP-INGEST-V8-20260831";
const CANONICAL_CHANNEL = "AlphaSignalsPro";
const MAX_PHOTO_BASE64 = 4_000_000;

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      "x-asp-ingest-version": INGEST_VERSION,
      "cache-control": "no-store",
    },
  });
}

function authenticated(request: Request): boolean {
  const expected = process.env.WEBSITE_INGEST_SECRET?.trim();
  const supplied = request.headers.get("x-website-ingest-secret")?.trim();
  return Boolean(expected && supplied && supplied === expected);
}

export const Route = createFileRoute("/api/news-ingest-v2")({
  server: {
    handlers: {
      GET: async () =>
        json({
          ok: true,
          service: "news-ingest-v2",
          version: INGEST_VERSION,
          channel: CANONICAL_CHANNEL,
        }),

      POST: async ({ request }) => {
        if (!authenticated(request)) {
          return json({
            ok: false,
            error: "Unauthorized",
            version: INGEST_VERSION,
          }, 401);
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
          return json({ ok: false, error: "Invalid JSON", version: INGEST_VERSION }, 400);
        }

        const messageId = Number(body.messageId);
        const text = typeof body.text === "string" ? body.text : "";
        const publishedAt = new Date(String(body.publishedAt ?? ""));
        const receivedChannel = typeof body.channelUsername === "string"
          ? body.channelUsername.trim().replace(/^@/, "")
          : "";
        const photoBase64 = body.photoBase64?.trim() || null;
        const photoBuffer = photoBase64 ? Buffer.from(photoBase64, "base64") : null;
        const photoMimeType = photoBuffer ? (body.photoMimeType?.trim() || "image/jpeg") : null;

        if (!Number.isSafeInteger(messageId) || messageId <= 0) {
          return json({ ok: false, error: "messageId must be a positive integer", version: INGEST_VERSION }, 400);
        }
        if (Number.isNaN(publishedAt.getTime())) {
          return json({ ok: false, error: "Invalid publishedAt", version: INGEST_VERSION }, 400);
        }
        if (photoBase64 && photoBase64.length > MAX_PHOTO_BASE64) {
          return json({ ok: false, error: "Photo is too large", version: INGEST_VERSION }, 413);
        }

        try {
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
              `@${CANONICAL_CHANNEL}`,
              messageId,
              CANONICAL_CHANNEL,
              text,
              publishedAt.toISOString(),
              photoBuffer,
              photoMimeType,
              body.messageUrl || `https://t.me/${CANONICAL_CHANNEL}/${messageId}`,
            ],
          );

          return json({
            ok: true,
            messageId,
            version: INGEST_VERSION,
            channel: CANONICAL_CHANNEL,
            receivedChannel,
          });
        } catch (error) {
          console.error("ASP news ingest database error:", error);
          return json({
            ok: false,
            error: "Database error",
            version: INGEST_VERSION,
          }, 500);
        }
      },
    },
  },
});
