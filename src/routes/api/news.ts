import { createFileRoute } from "@tanstack/react-router";
import { listTelegramPosts } from "@/lib/telegram-feed";

export const Route = createFileRoute("/api/news")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await listTelegramPosts(100);
        return Response.json(
          { posts },
          { headers: { "Cache-Control": "no-store" } },
        );
      },
    },
  },
});
