import { createFileRoute } from "@tanstack/react-router";
import { getTelegramVideo } from "@/lib/telegram-feed";

export const Route = createFileRoute("/api/telegram-video")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = Number(url.searchParams.get("id"));
        if (!Number.isSafeInteger(id) || id <= 0) return new Response("Bad request", { status: 400 });
        const row = await getTelegramVideo(id);
        if (!row?.video_data) return new Response("Not found", { status: 404 });
        const bytes = row.video_data instanceof Uint8Array ? row.video_data : new Uint8Array(row.video_data as unknown as ArrayBuffer);
        const total = bytes.byteLength;
        const type = row.video_mime_type || "video/mp4";
        const range = request.headers.get("range");
        const common = { "Content-Type": type, "Cache-Control": "public, max-age=86400, immutable", "X-Content-Type-Options": "nosniff", "Accept-Ranges": "bytes" };
        if (!range) return new Response(bytes, { headers: { ...common, "Content-Length": String(total) } });
        const match = /^bytes=(\d*)-(\d*)$/.exec(range);
        if (!match) return new Response(null, { status: 416, headers: { ...common, "Content-Range": `bytes */${total}` } });
        let start = match[1] ? Number(match[1]) : Math.max(0, total - Number(match[2]) - 1);
        let end = match[2] ? Number(match[2]) : total - 1;
        if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start >= total || start > end) return new Response(null, { status: 416, headers: { ...common, "Content-Range": `bytes */${total}` } });
        end = Math.min(end, total - 1);
        const chunk = bytes.slice(start, end + 1);
        return new Response(chunk, { status: 206, headers: { ...common, "Content-Length": String(chunk.byteLength), "Content-Range": `bytes ${start}-${end}/${total}` } });
      },
    },
  },
});
