import { createFileRoute } from "@tanstack/react-router";
import { funFactsPayload } from "@/lib/fun-facts-server";

/**
 * /api/fun-facts — fresh-edition Fun Facts feed.
 *
 * A new edition rotates in every ~60 hours (two to three days). Every fact
 * comes exclusively from the desk's curated crypto notebook — no generic
 * history feeds. See src/lib/fun-facts-server.ts.
 */
export const Route = createFileRoute("/api/fun-facts")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const payload = await funFactsPayload();
          return Response.json(payload, {
            headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=7200" },
          });
        } catch (error) {
          console.error("[fun-facts]", error instanceof Error ? error.message : error);
          return Response.json({ error: "Fun facts are temporarily unavailable" }, { status: 503 });
        }
      },
    },
  },
});
