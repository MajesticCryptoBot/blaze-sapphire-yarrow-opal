import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

const CHANNEL = "AlphaSignalsPro";

export const Route = createFileRoute("/api/news")({
  server: {
    handlers: {
      GET: async () => {
        const sql = await getSql();
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
           where chat_username = $1
           order by published_at desc
           limit 100`,
          [CHANNEL],
        );

        return Response.json(
          {
            posts: rows.map((row) => ({
              id: Number(row.id),
              text: row.text,
              publishedAt: new Date(row.published_at).toISOString(),
              messageUrl: row.message_url,
              hasPhoto: Boolean(row.photo_data),
            })),
          },
          { headers: { "Cache-Control": "no-store" } },
        );
      },
    },
  },
});
