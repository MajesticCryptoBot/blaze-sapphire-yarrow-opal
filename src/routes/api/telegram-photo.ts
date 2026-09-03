import { createFileRoute } from "@tanstack/react-router";
import { getTelegramPhoto } from "@/lib/telegram-feed";

export const Route = createFileRoute("/api/telegram-photo")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = Number(url.searchParams.get("id"));
        const photoNumber = Number(url.searchParams.get("photo") || "1");
        if (!Number.isSafeInteger(id) || id <= 0 || ![1, 2].includes(photoNumber)) {
          return new Response("Bad request", { status: 400 });
        }

        const row = await getTelegramPhoto(id, photoNumber);
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
