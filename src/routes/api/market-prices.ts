import { createFileRoute } from "@tanstack/react-router";

const SYMBOLS = ["BTC", "ETH", "XRP", "SOL", "BNB"] as const;
const SYMBOL_TO_NAME: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  XRP: "XRP",
  SOL: "Solana",
  BNB: "BNB",
};
const CACHE_TTL_MS = 180_000;

type Market = { symbol: string; name: string; price: number; change24h: number; lastUpdated: string };

type CacheState = { expiresAt: number; data: Market[] };
const globalRef = globalThis as typeof globalThis & { __cmcMarketCache__?: CacheState };

async function fetchMarkets(): Promise<Market[]> {
  const apiKey = process.env.CMC_API_KEY?.trim();
  if (!apiKey) throw new Error("CMC_API_KEY is not configured");

  const url = new URL("https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest");
  url.searchParams.set("symbol", SYMBOLS.join(","));
  url.searchParams.set("convert", "USD");

  const response = await fetch(url, {
    headers: { "X-CMC_PRO_API_KEY": apiKey, Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`CoinMarketCap HTTP ${response.status}`);

  const payload = (await response.json()) as {
    data?: Record<string, Array<{ symbol: string; name: string; quote?: { USD?: { price?: number; percent_change_24h?: number; last_updated?: string } } }>>;
  };

  const data: Market[] = [];
  for (const symbol of SYMBOLS) {
    const coin = payload.data?.[symbol]?.[0];
    const quote = coin?.quote?.USD;
    if (!coin || typeof quote?.price !== "number") continue;
    data.push({
      symbol,
      name: SYMBOL_TO_NAME[symbol],
      price: quote.price,
      change24h: typeof quote.percent_change_24h === "number" ? quote.percent_change_24h : 0,
      lastUpdated: quote.last_updated ?? new Date().toISOString(),
    });
  }
  if (data.length !== SYMBOLS.length) throw new Error("CoinMarketCap returned incomplete market data");
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
