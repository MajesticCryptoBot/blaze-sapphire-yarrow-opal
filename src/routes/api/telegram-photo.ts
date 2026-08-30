import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

export const Route = createFileRoute("/api/telegram-photo")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const id = Number(new URL(request.url).searchParams.get("id"));
        if (!Number.isSafeInteger(id) || id <= 0) {
          return new Response("Bad request", { status: 400 });
        }

        const sql = await getSql();
        const rows = await sql.query<{ photo_data: Uint8Array | null; photo_mime_type: string | null }>(
          "select photo_data, photo_mime_type from telegram_posts where id = $1 limit 1",
          [id],
        );
        const row = rows[0];
        if (!row?.photo_data) return new Response("Not found", { status: 404 });

        const bytes = row.photo_data instanceof Uint8Array
          ? row.photo_data
          : new Uint8Array(row.photo_data as unknown as ArrayBuffer);

        return new Response(bytes, {
          headers: {
            "Content-Type": row.photo_mime_type || "image/jpeg",
            "Cache-Control": "public, max-age=86400, immutable",
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
