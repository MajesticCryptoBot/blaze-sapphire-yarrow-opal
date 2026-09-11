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
        if (!row?.video_url && !row?.video_data) return new Response("Not found", { status: 404 });

        if (row.video_url) {
          return Response.redirect(row.video_url, 302);
        }

        const bytes = row.video_data instanceof Uint8Array
          ? row.video_data
          : new Uint8Array(row.video_data as unknown as ArrayBuffer);
        const mime = row.video_mime_type || "video/mp4";
        const range = request.headers.get("range");
        const match = range ? /bytes=(\d+)-(\d*)/.exec(range) : null;

        if (match) {
          const start = Number(match[1]);
          const end = match[2] ? Number(match[2]) : bytes.length - 1;
          if (start >= bytes.length || end >= bytes.length || start > end) {
            return new Response(null, {
              status: 416,
              headers: { "Content-Range": `bytes */${bytes.length}` },
            });
          }
          const slice = bytes.slice(start, end + 1);
          return new Response(slice, {
            status: 206,
            headers: {
              "Content-Type": mime,
              "Content-Length": String(slice.byteLength),
              "Content-Range": `bytes ${start}-${end}/${bytes.length}`,
              "Accept-Ranges": "bytes",
              "Cache-Control": "public, max-age=86400, immutable",
              "X-Content-Type-Options": "nosniff",
              "Content-Disposition": "inline",
            },
          });
        }

        return new Response(bytes, {
          headers: {
            "Content-Type": mime,
            "Content-Length": String(bytes.byteLength),
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=86400, immutable",
            "X-Content-Type-Options": "nosniff",
            "Content-Disposition": "inline",
          },
        });
      },
    },
  },
});
