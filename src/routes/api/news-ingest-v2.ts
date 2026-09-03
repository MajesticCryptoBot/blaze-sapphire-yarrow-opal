import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

const INGEST_VERSION = "ASP-INGEST-V12-VIDEO-20260903";
const CANONICAL_CHANNEL = "AlphaSignalsPro";
const MAX_PHOTO_BASE64 = 4_000_000;
const MAX_VIDEO_BASE64 = 3_200_000;

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

async function ensureVideoColumns(sql: Awaited<ReturnType<typeof getSql>>) {
  const columns = await sql.query<{ name: string }>("PRAGMA table_info(telegram_posts)");
  const names = new Set(columns.map((row) => String(row.name)));
  if (!names.has("video_data")) await sql.query("ALTER TABLE telegram_posts ADD COLUMN video_data BLOB");
  if (!names.has("video_mime_type")) await sql.query("ALTER TABLE telegram_posts ADD COLUMN video_mime_type TEXT");
}

export const Route = createFileRoute("/api/news-ingest-v2")({
  server: {
    handlers: {
      GET: async () => json({ ok: true, service: "news-ingest-v2", version: INGEST_VERSION, channel: CANONICAL_CHANNEL }),

      POST: async ({ request }) => {
        if (!authenticated(request)) {
          return json({ ok: false, error: "Unauthorized", version: INGEST_VERSION }, 401);
        }

        let body: {
          messageId?: number | string;
          text?: string;
          publishedAt?: string;
          messageUrl?: string | null;
          channelUsername?: string;
          photoBase64?: string | null;
          photoMimeType?: string | null;
          photoBase64_2?: string | null;
          photoBase642?: string | null;
          photoMimeType_2?: string | null;
          photoMimeType2?: string | null;
          videoBase64?: string | null;
          videoMimeType?: string | null;
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
        const photoBase64_2 = body.photoBase64_2?.trim() || body.photoBase642?.trim() || null;
        const videoBase64 = body.videoBase64?.trim() || null;
        const photoBuffer = photoBase64 ? Buffer.from(photoBase64, "base64") : null;
        const photoBuffer2 = photoBase64_2 ? Buffer.from(photoBase64_2, "base64") : null;
        const videoBuffer = videoBase64 ? Buffer.from(videoBase64, "base64") : null;

        const duplicateSecondPhoto = Boolean(photoBuffer && photoBuffer2 && photoBuffer.equals(photoBuffer2));
        const storedPhotoBuffer2 = duplicateSecondPhoto ? null : photoBuffer2;
        const storedPhotoMimeType2 = storedPhotoBuffer2
          ? (body.photoMimeType_2?.trim() || body.photoMimeType2?.trim() || "image/jpeg")
          : null;
        const photoMimeType = photoBuffer ? (body.photoMimeType?.trim() || "image/jpeg") : null;
        const videoMimeType = videoBuffer ? (body.videoMimeType?.trim() || "video/mp4") : null;

        if (!Number.isSafeInteger(messageId) || messageId <= 0) {
          return json({ ok: false, error: "messageId must be a positive integer", version: INGEST_VERSION }, 400);
        }
        if (Number.isNaN(publishedAt.getTime())) {
          return json({ ok: false, error: "Invalid publishedAt", version: INGEST_VERSION }, 400);
        }
        if (photoBase64 && photoBase64.length > MAX_PHOTO_BASE64) {
          return json({ ok: false, error: "Photo is too large", version: INGEST_VERSION }, 413);
        }
        if (photoBase64_2 && photoBase64_2.length > MAX_PHOTO_BASE64) {
          return json({ ok: false, error: "Second photo is too large", version: INGEST_VERSION }, 413);
        }
        if (videoBase64 && videoBase64.length > MAX_VIDEO_BASE64) {
          return json({ ok: false, error: "Video is too large for direct website ingestion", version: INGEST_VERSION }, 413);
        }

        try {
          const sql = await getSql();
          await ensureVideoColumns(sql);
          await sql.query(
            `insert into telegram_posts
               (chat_id, message_id, chat_username, chat_title, text, published_at,
                photo_data, photo_mime_type, photo_data_2, photo_mime_type_2,
                video_data, video_mime_type, message_url, updated_at)
             values ($1, $2, $3, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
             on conflict (chat_id, message_id) do update set
               text = excluded.text,
               published_at = excluded.published_at,
               photo_data = coalesce(excluded.photo_data, telegram_posts.photo_data),
               photo_mime_type = coalesce(excluded.photo_mime_type, telegram_posts.photo_mime_type),
               photo_data_2 = coalesce(excluded.photo_data_2, telegram_posts.photo_data_2),
               photo_mime_type_2 = coalesce(excluded.photo_mime_type_2, telegram_posts.photo_mime_type_2),
               video_data = coalesce(excluded.video_data, telegram_posts.video_data),
               video_mime_type = coalesce(excluded.video_mime_type, telegram_posts.video_mime_type),
               message_url = excluded.message_url,
               updated_at = CURRENT_TIMESTAMP`,
            [
              `@${CANONICAL_CHANNEL}`,
              messageId,
              CANONICAL_CHANNEL,
              text,
              publishedAt.toISOString(),
              photoBuffer,
              photoMimeType,
              storedPhotoBuffer2,
              storedPhotoMimeType2,
              videoBuffer,
              videoMimeType,
              body.messageUrl || `https://t.me/${CANONICAL_CHANNEL}/${messageId}`,
            ],
          );

          return json({
            ok: true,
            messageId,
            version: INGEST_VERSION,
            channel: CANONICAL_CHANNEL,
            receivedChannel,
            photoCount: Number(Boolean(photoBuffer)) + Number(Boolean(storedPhotoBuffer2)),
            video: Boolean(videoBuffer),
            duplicateSecondPhotoIgnored: duplicateSecondPhoto,
          });
        } catch (error) {
          console.error("ASP news ingest database error:", error);
          return json({ ok: false, error: "Database error", version: INGEST_VERSION }, 500);
        }
      },
    },
  },
});
