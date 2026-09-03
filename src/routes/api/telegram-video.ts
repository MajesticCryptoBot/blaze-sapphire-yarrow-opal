import { createFileRoute } from "@tanstack/react-router";
import { getTelegramVideo } from "@/lib/telegram-feed";

export const Route = createFileRoute("/api/telegram-video")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = Number(url.searchParams.get("id"));
        if (!Number.isSafeInteger(id) || id <= 0) {
          return new Response("Bad request", { status: 400 });
        }

        const row = await getTelegramVideo(id);
        if (!row?.video_data) return new Response("Not found", { status: 404 });

        const bytes = row.video_data instanceof Uint8Array
          ? row.video_data
          : new Uint8Array(row.video_data as unknown as ArrayBuffer);

        return new Response(bytes, {
          headers: {
            "Content-Type": row.video_mime_type || "video/mp4",
            "Cache-Control": "public, max-age=86400, immutable",
            "X-Content-Type-Options": "nosniff",
            "Accept-Ranges": "bytes",
          },
        });
      },
    },
  },
});
