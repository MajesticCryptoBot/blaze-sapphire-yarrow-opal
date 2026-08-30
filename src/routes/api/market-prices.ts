import { createFileRoute } from "@tanstack/react-router";

const ASSETS = [
  { id: 1, symbol: "BTC", name: "Bitcoin" },
  { id: 1027, symbol: "ETH", name: "Ethereum" },
  { id: 52, symbol: "XRP", name: "XRP" },
  { id: 5426, symbol: "SOL", name: "Solana" },
  { id: 1839, symbol: "BNB", name: "BNB" },
] as const;
const CACHE_TTL_MS = 180_000;

type Market = { symbol: string; name: string; price: number; change24h: number; lastUpdated: string };
type CacheState = { expiresAt: number; data: Market[] };
const globalRef = globalThis as typeof globalThis & { __cmcMarketCache__?: CacheState };

async function fetchMarkets(): Promise<Market[]> {
  const apiKey = process.env.CMC_API_KEY?.trim();
  if (!apiKey) throw new Error("CMC_API_KEY is not configured");

  const url = new URL("https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/latest");
  url.searchParams.set("id", ASSETS.map((asset) => asset.id).join(","));
  url.searchParams.set("convert", "USD");
  url.searchParams.set("skip_invalid", "true");

  const response = await fetch(url, {
    headers: { "X-CMC_PRO_API_KEY": apiKey, Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`CoinMarketCap HTTP ${response.status}`);

  const payload = (await response.json()) as {
    data?: Array<{
      id: number;
      name: string;
      symbol: string;
      quote?: Array<{
        USD?: {
          price?: number;
          percent_change_24h?: number;
          last_updated?: string;
        };
      }>;
    }>;
  };

  const byId = new Map((payload.data ?? []).map((asset) => [asset.id, asset]));
  const data: Market[] = [];

  for (const asset of ASSETS) {
    const coin = byId.get(asset.id);
    const quote = coin?.quote?.[0]?.USD;
    if (!coin || typeof quote?.price !== "number") continue;
    data.push({
      symbol: asset.symbol,
      name: asset.name,
      price: quote.price,
      change24h: typeof quote.percent_change_24h === "number" ? quote.percent_change_24h : 0,
      lastUpdated: quote.last_updated ?? new Date().toISOString(),
    });
  }

  if (data.length !== ASSETS.length) {
    throw new Error(`CoinMarketCap returned ${data.length}/${ASSETS.length} requested assets`);
  }
  return data;
}

export const Route = createFileRoute("/api/market-prices")({
  server: {
    handlers: {
      GET: async () => {
        const now = Date.now();
        const cached = globalRef.__cmcMarketCache__;
        if (cached && cached.expiresAt > now) {
          return Response.json({ data: cached.data, cached: true }, { headers: { "Cache-Control": "no-store" } });
        }

        try {
          const data = await fetchMarkets();
          globalRef.__cmcMarketCache__ = { data, expiresAt: now + CACHE_TTL_MS };
          return Response.json({ data, cached: false }, { headers: { "Cache-Control": "no-store" } });
        } catch (error) {
          if (cached) {
            return Response.json({ data: cached.data, cached: true, stale: true }, { headers: { "Cache-Control": "no-store" } });
          }
          console.error("[market-prices]", error);
          return Response.json({ error: "Market data is temporarily unavailable" }, { status: 503 });
        }
      },
    },
  },
});
