import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

const CHANNEL = (process.env.TELEGRAM_CHANNEL_USERNAME || "AlphaSignalsPro").replace(/^@/, "");
const DAY_MS = 24 * 60 * 60 * 1000;

export const Route = createFileRoute("/api/news")({
  server: {
    handlers: {
      GET: async () => {
        const sql = await getSql();
        const cutoff = new Date(Date.now() - DAY_MS).toISOString();
        const rows = await sql.query<{
          id: number;
          text: string;
          published_at: string;
          message_url: string | null;
          photo_data: string | Uint8Array | null;
          photo_mime_type: string | null;
        }>(
          `select id, text, published_at, message_url, photo_data, photo_mime_type
           from telegram_posts
           where chat_username = $1 and published_at >= $2
           order by published_at desc
           limit 100`,
          [CHANNEL, cutoff],
        );

        return Response.json({
          posts: rows.map((row) => ({
            id: Number(row.id),
            text: row.text,
            publishedAt: new Date(row.published_at).toISOString(),
            messageUrl: row.message_url,
            hasPhoto: Boolean(row.photo_data),
          })),
        }, { headers: { "Cache-Control": "no-store" } });
      },
    },
  },
});
