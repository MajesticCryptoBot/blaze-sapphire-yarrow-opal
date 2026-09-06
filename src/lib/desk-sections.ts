export type DeskSection = {
  slug: string;
  label: string;
  kicker: string;
  headline: string;
  dek: string;
  wireTerms: string[];
};

export const DESK_SECTIONS: DeskSection[] = [
  {
    slug: "news",
    label: "News",
    kicker: "Newsroom",
    headline: "News",
    dek: "The full ASP tape — every brief, photo, and video as it hits the desk.",
    wireTerms: [],
  },
  {
    slug: "bitcoin",
    label: "Bitcoin",
    kicker: "Bitcoin desk",
    headline: "Bitcoin",
    dek: "BTC, ETF flows, miners, treasuries, and the monetary debate around Bitcoin.",
    wireTerms: ["bitcoin", "btc", "satoshi", "ordinals", "sats"],
  },
  {
    slug: "regulation",
    label: "Regulation",
    kicker: "Policy desk",
    headline: "Regulation",
    dek: "SEC, CFTC, ETFs, lawsuits, and market-structure rules.",
    wireTerms: [
      "regulation",
      "regulator",
      "sec",
      "cftc",
      "esma",
      "mica",
      "lawsuit",
      "subpoena",
      "etf",
      "compliance",
      "ban",
      "banned",
      "policy",
      "congress",
      "senate",
      "bill",
    ],
  },
  {
    slug: "altcoins",
    label: "Altcoins",
    kicker: "Altcoin desk",
    headline: "Altcoins",
    dek: "Ethereum, Solana, XRP, and the rest of the tape outside Bitcoin.",
    wireTerms: [
      "ethereum",
      "ether",
      "eth",
      "solana",
      "sol",
      "xrp",
      "ripple",
      "dogecoin",
      "doge",
      "cardano",
      "ada",
      "avalanche",
      "avax",
      "chainlink",
      "altcoin",
      "altcoins",
      "bnb",
      "polygon",
      "ton",
      "sui",
      "hype",
    ],
  },
  {
    slug: "us",
    label: "US",
    kicker: "United States",
    headline: "United States",
    dek: "The Fed, Treasury, Washington, and U.S. macro that moves risk assets.",
    wireTerms: [
      "united states",
      "u.s.",
      "u.s",
      "usa",
      "washington",
      "white house",
      "federal reserve",
      "the fed",
      "fomc",
      "powell",
      "warsh",
      "treasury",
      "dollar",
      "dxy",
      "cpi",
      "nfp",
      "nonfarm",
      "wall street",
      "nasdaq",
      "s&p",
      "nyse",
    ],
  },
  {
    slug: "international",
    label: "International",
    kicker: "World desk",
    headline: "International",
    dek: "Non-U.S. briefs from the tape — Europe, Asia, and the rest of the world.",
    wireTerms: [],
  },
  {
    slug: "china",
    label: "China",
    kicker: "China desk",
    headline: "China",
    dek: "Beijing policy, Chinese markets, and the China-crypto corridor.",
    wireTerms: [
      "china",
      "chinese",
      "beijing",
      "shanghai",
      "shenzhen",
      "hong kong",
      "pboc",
      "yuan",
      "renminbi",
      "hang seng",
      "alibaba",
      "tencent",
      "bytedance",
    ],
  },
  {
    slug: "fun-facts",
    label: "Fun Facts",
    kicker: "Notebook",
    headline: "Fun facts",
    dek: "Short notes, curiosities, and asides from the tape.",
    wireTerms: ["fun fact", "fun facts", "did you know", "trivia", "curious", "odd", "notebook", "aside"],
  },
];

function termPattern(term: string) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  if (term.length <= 4) return new RegExp(`\\b${escaped}\\b`, "i");
  return new RegExp(escaped, "i");
}

function matchesTerms(text: string, terms: string[]) {
  return terms.some((term) => termPattern(term).test(text));
}

export function matchesDesk(text: string, section: DeskSection) {
  if (section.slug === "news") return true;
  if (section.slug === "international") {
    const us = DESK_SECTIONS.find((item) => item.slug === "us");
    return us ? !matchesTerms(text, us.wireTerms) : true;
  }
  if (section.wireTerms.length === 0) return true;
  return matchesTerms(text, section.wireTerms);
}

export function getDeskSection(slug: string): DeskSection | undefined {
  return DESK_SECTIONS.find((section) => section.slug === slug);
}

export function isDeskSlug(slug: string): boolean {
  return DESK_SECTIONS.some((section) => section.slug === slug);
}
