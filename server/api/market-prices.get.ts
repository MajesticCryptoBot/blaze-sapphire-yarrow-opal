import { CMC_ASSETS, parseCmcMarkets, type MarketQuote } from "../../src/lib/cmc-markets";

const CMC_URL = "https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/latest";
const CACHE_TTL_MS = 3 * 60 * 1000;

type Cached = {
  fetchedAt: number;
  data: MarketQuote[];
};

const globalRef = globalThis as typeof globalThis & {
  __cmcMarketCache__?: Cached;
  __cmcMarketPromise__?: Promise<Cached>;
};

async function fetchPrices(): Promise<Cached> {
  const apiKey = process.env.CMC_API_KEY?.trim();
  if (!apiKey) throw new Error("CMC_API_KEY is not configured");

  const response = await fetch(
    `${CMC_URL}?id=${CMC_ASSETS.map((asset) => asset.id).join(",")}&convert=USD`,
    {
      headers: {
        Accept: "application/json",
        "X-CMC_PRO_API_KEY": apiKey,
      },
    },
  );

  const rawText = await response.text();
  let payload: unknown = {};
  try {
    payload = JSON.parse(rawText) as unknown;
  } catch {
    throw new Error(`CoinMarketCap returned non-JSON HTTP ${response.status}`);
  }

  if (!response.ok) {
    throw new Error(`CoinMarketCap HTTP ${response.status}: ${rawText.slice(0, 300)}`);
  }

  return { fetchedAt: Date.now(), data: parseCmcMarkets(payload) };
}

export default async function handler() {
  const now = Date.now();
  const cached = globalRef.__cmcMarketCache__;
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return Response.json({
      data: cached.data,
      fetchedAt: new Date(cached.fetchedAt).toISOString(),
      cached: true,
    });
  }

  globalRef.__cmcMarketPromise__ ??= fetchPrices().finally(() => {
    globalRef.__cmcMarketPromise__ = undefined;
  });

  try {
    const fresh = await globalRef.__cmcMarketPromise__;
    globalRef.__cmcMarketCache__ = fresh;
    return Response.json({
      data: fresh.data,
      fetchedAt: new Date(fresh.fetchedAt).toISOString(),
      cached: false,
    });
  } catch (error) {
    console.error("[market-prices]", error instanceof Error ? error.message : error);
    if (cached) {
      return Response.json({
        data: cached.data,
        fetchedAt: new Date(cached.fetchedAt).toISOString(),
        cached: true,
        stale: true,
      });
    }
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to fetch market prices" },
      { status: 503 },
    );
  }
}
