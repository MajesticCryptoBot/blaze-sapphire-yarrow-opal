import { createFileRoute } from "@tanstack/react-router";
import { getTelegramPost, parsePublicId } from "@/lib/telegram-feed";

export const Route = createFileRoute("/api/news/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const id = parsePublicId(params.id);
        if (id === null) return Response.json({ error: "Invalid article id" }, { status: 400 });

        const post = await getTelegramPost(id);
        if (!post) return Response.json({ error: "Article not found" }, { status: 404 });

        return Response.json(
          { post },
          { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
        );
      },
    },
  },
});
