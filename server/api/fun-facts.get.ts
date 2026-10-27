import { funFactsPayload } from "../../src/lib/fun-facts-server";

/**
 * Nitro-side /api/fun-facts handler (production parity with the other
 * server/api/* routes). The TanStack route in src/routes/api/fun-facts.ts
 * serves dev + Vercel; both share the exact same payload builder.
 */
export default async function handler() {
  const payload = await funFactsPayload();
  return Response.json(payload, {
    headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=7200" },
  });
}
