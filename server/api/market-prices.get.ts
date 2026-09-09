import { PRICE_REFRESH_MS, fetchBinanceMarkets, type MarketQuote } from "../../src/lib/binance-markets";

type Cached = {
  fetchedAt: number;
  data: MarketQuote[];
};

const globalRef = globalThis as typeof globalThis & {
  __binanceMarketCache__?: Cached;
  __binanceMarketPromise__?: Promise<Cached>;
};

async function fetchPrices(): Promise<Cached> {
  const data = await fetchBinanceMarkets();
  if (data.length === 0) throw new Error("Binance returned no quotes");
  return { fetchedAt: Date.now(), data };
}

export default async function handler() {
  const now = Date.now();
  const cached = globalRef.__binanceMarketCache__;
  if (cached && now - cached.fetchedAt < PRICE_REFRESH_MS) {
    return Response.json({
      data: cached.data,
      fetchedAt: new Date(cached.fetchedAt).toISOString(),
      cached: true,
    });
  }

  globalRef.__binanceMarketPromise__ ??= fetchPrices().finally(() => {
    globalRef.__binanceMarketPromise__ = undefined;
  });

  try {
    const fresh = await globalRef.__binanceMarketPromise__;
    globalRef.__binanceMarketCache__ = fresh;
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
