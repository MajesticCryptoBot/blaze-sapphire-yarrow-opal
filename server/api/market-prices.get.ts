const CMC_URL = "https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/latest";
const ASSET_IDS = [1, 1027, 52, 5426, 1839] as const;
const SYMBOLS: Record<number, string> = {
  1: "BTC",
  1027: "ETH",
  52: "XRP",
  5426: "SOL",
  1839: "BNB",
};

const CACHE_TTL_MS = 3 * 60 * 1000;

type Cached = {
  fetchedAt: number;
  data: Array<{
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    lastUpdated: string | null;
  }>;
};

const globalRef = globalThis as typeof globalThis & {
  __cmcMarketCache__?: Cached;
  __cmcMarketPromise__?: Promise<Cached>;
};

async function fetchPrices(): Promise<Cached> {
  const apiKey = process.env.CMC_API_KEY?.trim();
  if (!apiKey) throw new Error("CMC_API_KEY is not configured");

  const response = await fetch(
    `${CMC_URL}?id=${ASSET_IDS.join(",")}&convert=USD`,
    {
      headers: {
        Accept: "application/json",
        "X-CMC_PRO_API_KEY": apiKey,
      },
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`CoinMarketCap HTTP ${response.status}: ${body.slice(0, 300)}`);
  }

  const payload = (await response.json()) as {
    status?: { error_code?: number | string; error_message?: string | null };
    data?: Record<string, {
      id: number;
      name: string;
      symbol: string;
      quote?: { USD?: { price?: number; percent_change_24h?: number; last_updated?: string } };
    }>;
  };

  if (String(payload.status?.error_code ?? "0") !== "0") {
    throw new Error(payload.status?.error_message || "CoinMarketCap returned an error");
  }

  const data = ASSET_IDS.map((id) => {
    const asset = payload.data?.[String(id)];
    const usd = asset?.quote?.USD;
    if (!asset || typeof usd?.price !== "number") {
      throw new Error(`CoinMarketCap did not return ${SYMBOLS[id]}`);
    }
    return {
      symbol: SYMBOLS[id],
      name: asset.name,
      price: usd.price,
      change24h: typeof usd.percent_change_24h === "number" ? usd.percent_change_24h : 0,
      lastUpdated: usd.last_updated ?? null,
    };
  });

  return { fetchedAt: Date.now(), data };
}

export default async function handler() {
  const now = Date.now();
  const cached = globalRef.__cmcMarketCache__;
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return Response.json({ ...cached, fetchedAt: new Date(cached.fetchedAt).toISOString(), cached: true });
  }

  globalRef.__cmcMarketPromise__ ??= fetchPrices().finally(() => {
    globalRef.__cmcMarketPromise__ = undefined;
  });

  try {
    const fresh = await globalRef.__cmcMarketPromise__;
    globalRef.__cmcMarketCache__ = fresh;
    return Response.json({ ...fresh, fetchedAt: new Date(fresh.fetchedAt).toISOString(), cached: false });
  } catch (error) {
    if (cached) {
      return Response.json({
        ...cached,
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
