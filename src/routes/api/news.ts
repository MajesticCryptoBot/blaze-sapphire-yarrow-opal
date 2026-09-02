import { createFileRoute } from "@tanstack/react-router";
import { listTelegramPosts } from "@/lib/telegram-feed";

export const Route = createFileRoute("/api/news")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await listTelegramPosts(10);
        return Response.json(
          { posts },
          {
            headers: {
              "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
            },
          },
        );
      },
    },
  },
});
