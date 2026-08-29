export type Ticker = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  spark: number[];
};

export const TICKERS: Ticker[] = [
  { symbol: "BTC", name: "Bitcoin", price: 78894.58, change: -1.12, spark: [81, 80, 79.2, 78.4, 79.1, 78.9, 78.7] },
  { symbol: "ETH", name: "Ether", price: 2941.2, change: 0.84, spark: [2.86, 2.88, 2.9, 2.87, 2.92, 2.94, 2.94] },
  { symbol: "SOL", name: "Solana", price: 100.16, change: 5.42, spark: [92, 93.4, 94.1, 96.8, 98.2, 99.4, 100.2] },
  { symbol: "XRP", name: "XRP", price: 1.4458, change: 0.62, spark: [1.41, 1.42, 1.43, 1.44, 1.43, 1.44, 1.45] },
  { symbol: "NVDA", name: "Nvidia", price: 178.42, change: 2.31, spark: [168, 170, 172, 171, 174, 176, 178] },
  { symbol: "GOLD", name: "Gold", price: 2486.1, change: 0.41, spark: [2468, 2472, 2475, 2471, 2479, 2483, 2486] },
  { symbol: "DXY", name: "US Dollar", price: 104.28, change: 0.18, spark: [103.9, 104.0, 104.1, 104.05, 104.2, 104.22, 104.28] },
  { symbol: "UST10Y", name: "US 10Y", price: 4.31, change: 0.06, spark: [4.18, 4.21, 4.22, 4.25, 4.28, 4.3, 4.31] },
];
