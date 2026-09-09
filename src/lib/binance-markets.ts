export const PRICE_REFRESH_MS = 5_000;

export type MarketGroup = "crypto" | "bstock";

export type MarketAsset = {
  pair: string;
  symbol: string;
  name: string;
  group: MarketGroup;
};

export const BINANCE_ASSETS: MarketAsset[] = [
  { pair: "BTCUSDT", symbol: "BTC", name: "Bitcoin", group: "crypto" },
  { pair: "ETHUSDT", symbol: "ETH", name: "Ethereum", group: "crypto" },
  { pair: "XRPUSDT", symbol: "XRP", name: "XRP", group: "crypto" },
  { pair: "SOLUSDT", symbol: "SOL", name: "Solana", group: "crypto" },
  { pair: "BNBUSDT", symbol: "BNB", name: "BNB", group: "crypto" },
  { pair: "GRAMUSDT", symbol: "GRAM", name: "Gram", group: "crypto" },
  { pair: "NEARUSDT", symbol: "NEAR", name: "NEAR", group: "crypto" },
  { pair: "ZECUSDT", symbol: "ZEC", name: "Zcash", group: "crypto" },
  { pair: "ADAUSDT", symbol: "ADA", name: "Cardano", group: "crypto" },
  { pair: "TRXUSDT", symbol: "TRX", name: "TRON", group: "crypto" },
  { pair: "SPCXBUSDT", symbol: "SPCXB", name: "SpaceX (bStocks)", group: "bstock" },
  { pair: "TSLABUSDT", symbol: "TSLAB", name: "Tesla (bStocks)", group: "bstock" },
  { pair: "AAPLBUSDT", symbol: "AAPLB", name: "Apple (bStocks)", group: "bstock" },
  { pair: "MSTRBUSDT", symbol: "MSTRB", name: "Strategy (bStocks)", group: "bstock" },
  { pair: "NVDABUSDT", symbol: "NVDAB", name: "NVIDIA (bStocks)", group: "bstock" },
];

export type MarketQuote = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  lastUpdated: string | null;
  group: MarketGroup;
};

const BINANCE_HOSTS = [
  "https://data-api.binance.vision",
  "https://api.binance.com",
] as const;

export async function fetchBinanceMarkets(): Promise<MarketQuote[]> {
  const symbols = JSON.stringify(BINANCE_ASSETS.map((asset) => asset.pair));

  for (const host of BINANCE_HOSTS) {
    try {
      const url = new URL("/api/v3/ticker/24hr", host);
      url.searchParams.set("symbols", symbols);
      const response = await fetch(url.toString(), {
        cache: "no-store",
        credentials: "omit",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) continue;

      const payload = (await response.json()) as unknown;
      if (!Array.isArray(payload)) continue;

      const byPair = new Map<string, { price: number; change24h: number }>();
      for (const row of payload) {
        if (!row || typeof row !== "object") continue;
        const item = row as Record<string, unknown>;
        const pair = String(item.symbol ?? "");
        const price = Number(item.lastPrice);
        const change24h = Number(item.priceChangePercent);
        if (pair && Number.isFinite(price)) {
          byPair.set(pair, {
            price,
            change24h: Number.isFinite(change24h) ? change24h : 0,
          });
        }
      }

      const now = new Date().toISOString();
      const quotes = BINANCE_ASSETS.flatMap((asset) => {
        const quote = byPair.get(asset.pair);
        if (!quote) return [];
        return [{
          symbol: asset.symbol,
          name: asset.name,
          price: quote.price,
          change24h: quote.change24h,
          lastUpdated: now,
          group: asset.group,
        }];
      });
      if (quotes.length > 0) return quotes;
    } catch {
      // Try the next official Binance market-data host.
    }
  }

  return [];
}
