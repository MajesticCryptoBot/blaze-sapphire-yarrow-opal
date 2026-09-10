export type DeskSection = { slug: string; label: string; kicker: string; headline: string; dek: string; wireTerms: string[] };

export const DESK_SECTIONS: DeskSection[] = [
  { slug: "crypto", label: "Crypto", kicker: "Crypto desk", headline: "Crypto", dek: "Bitcoin, Ethereum, Solana, XRP, stablecoins, ETFs, market structure, and the wider digital-asset tape.", wireTerms: ["bitcoin", "btc", "ethereum", "ether", "eth", "solana", "sol", "xrp", "ripple", "crypto", "cryptocurrency", "stablecoin", "token", "blockchain", "defi", "web3", "altcoin", "dogecoin", "cardano", "bnb", "sui", "etf"] },
  { slug: "tech", label: "Tech", kicker: "Technology desk", headline: "Tech", dek: "Major technology companies, products, platforms, chips, and the businesses shaping the digital economy.", wireTerms: ["apple", "microsoft", "nvidia", "amazon", "google", "alphabet", "meta", "tesla", "oracle", "amd", "intel", "qualcomm", "broadcom", "tsmc", "samsung", "technology", "tech", "iphone", "windows", "azure", "cloud", "semiconductor", "chip"] },
  { slug: "ai", label: "AI", kicker: "Artificial intelligence desk", headline: "AI", dek: "Artificial intelligence progress, models, products, research, infrastructure, and new capabilities.", wireTerms: ["artificial intelligence", "ai", "openai", "chatgpt", "anthropic", "claude", "gemini", "deepmind", "llm", "language model", "machine learning", "generative ai", "agentic", "ai model", "gpu"] },
  { slug: "stocks", label: "Stocks", kicker: "Equities desk", headline: "Stocks", dek: "Equity-market news, listed companies, earnings, indices, and developments affecting stock prices.", wireTerms: ["stock", "stocks", "shares", "equity", "equities", "earnings", "nasdaq", "nyse", "s&p 500", "dow jones", "wall street", "eps", "revenue", "guidance", "ipo", "buyback", "dividend"] },
  { slug: "innovation", label: "Innovation", kicker: "Innovation desk", headline: "Innovation", dek: "Forward-looking ideas, breakthroughs, products, and technologies with the potential to reshape markets and society.", wireTerms: ["innovation", "breakthrough", "prototype", "robotics", "quantum", "fusion", "biotech", "battery", "space technology", "autonomous", "new technology", "research breakthrough"] },
  { slug: "next-events", label: "Next Events", kicker: "Market calendar", headline: "Next Events", dek: "Selected market-moving events from official macro calendars, including CPI, employment data, and Federal Reserve decisions.", wireTerms: [] },
  { slug: "fun-facts", label: "Fun Facts", kicker: "Notebook", headline: "Fun facts", dek: "Short notes, curiosities, and asides from the tape.", wireTerms: ["fun fact", "fun facts", "did you know", "trivia", "curious", "odd", "notebook", "aside"] },
];

function termPattern(term: string) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  if (term.length <= 4) return new RegExp(`\\b${escaped}\\b`, "i");
  return new RegExp(escaped, "i");
}
function matchesTerms(text: string, terms: string[]) { return terms.some((term) => termPattern(term).test(text)); }
export function matchesDesk(post: { text: string; hasVideo?: boolean }, section: DeskSection) {
  if (section.slug === "next-events") return false;
  if (section.wireTerms.length === 0) return true;
  return matchesTerms(post.text, section.wireTerms);
}
export function getDeskSection(slug: string): DeskSection | undefined { return DESK_SECTIONS.find((section) => section.slug === slug); }
export function isDeskSlug(slug: string): boolean { return DESK_SECTIONS.some((section) => section.slug === slug); }
