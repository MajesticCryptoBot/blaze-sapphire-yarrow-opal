export const CMC_ASSETS = [
  { id: 1, symbol: "BTC", name: "Bitcoin" },
  { id: 1027, symbol: "ETH", name: "Ethereum" },
  { id: 52, symbol: "XRP", name: "XRP" },
  { id: 5426, symbol: "SOL", name: "Solana" },
  { id: 1839, symbol: "BNB", name: "BNB" },
] as const;

export type MarketQuote = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  lastUpdated: string | null;
};

type QuoteBlob = {
  symbol?: string;
  name?: string;
  price?: number;
  percent_change_24h?: number;
  percentChange24h?: number;
  last_updated?: string;
  lastUpdated?: string;
};

type AssetBlob = {
  id?: number;
  name?: string;
  symbol?: string;
  quote?: QuoteBlob[] | { USD?: QuoteBlob };
  quotes?: QuoteBlob[];
};

type CmcPayload = {
  data?: Record<string, AssetBlob> | AssetBlob[];
  status?: { error_code?: number | string; error_message?: string | null };
};

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getUsdQuote(asset: AssetBlob): QuoteBlob | undefined {
  const list = Array.isArray(asset.quote)
    ? asset.quote
    : Array.isArray(asset.quotes)
      ? asset.quotes
      : null;
  if (list) {
    return list.find((item) => {
      const code = (item.symbol ?? item.name ?? "").toUpperCase();
      return code === "USD";
    }) ?? list[0];
  }
  return asset.quote && !Array.isArray(asset.quote) ? asset.quote.USD : undefined;
}

function collectAssets(data: CmcPayload["data"]): AssetBlob[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return Object.values(data);
}

export function parseCmcMarkets(payload: unknown): MarketQuote[] {
  const body = (payload ?? {}) as CmcPayload;
  const errorCode = body.status?.error_code;
  if (errorCode !== undefined && String(errorCode) !== "0") {
    throw new Error(body.status?.error_message || `CoinMarketCap error ${errorCode}`);
  }

  const assets = collectAssets(body.data);
  const byId = new Map<number, AssetBlob>();
  const bySymbol = new Map<string, AssetBlob>();
  for (const asset of assets) {
    if (typeof asset.id === "number") byId.set(asset.id, asset);
    if (asset.symbol) bySymbol.set(asset.symbol.toUpperCase(), asset);
  }

  return CMC_ASSETS.map((wanted) => {
    const coin = byId.get(wanted.id) ?? bySymbol.get(wanted.symbol);
    const quote = coin ? getUsdQuote(coin) : undefined;
    const price = asNumber(quote?.price);
    if (!coin || price == null) {
      throw new Error(`CoinMarketCap did not return ${wanted.symbol}`);
    }
    return {
      symbol: wanted.symbol,
      name: coin.name ?? wanted.name,
      price,
      change24h: asNumber(quote?.percent_change_24h) ?? asNumber(quote?.percentChange24h) ?? 0,
      lastUpdated: quote?.last_updated ?? quote?.lastUpdated ?? null,
    };
  });
}
