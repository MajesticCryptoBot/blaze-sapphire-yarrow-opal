export type DeskStory = {
  title: string;
  dek: string;
  href?: string;
};

export type DeskPhoto = {
  src: string;
  caption: string;
};

export type DeskVideo = {
  src: string;
  caption: string;
};

export type DeskSection = {
  slug: string;
  label: string;
  kicker: string;
  headline: string;
  dek: string;
  paragraphs: string[];
  stories: DeskStory[];
  photos: DeskPhoto[];
  videos: DeskVideo[];
  wireTerms: string[];
};

export const DESK_SECTIONS: DeskSection[] = [
  {
    slug: "news",
    label: "News",
    kicker: "Newsroom",
    headline: "The news desk",
    dek: "A dedicated room for original briefs, photography, and video packages beyond the live tape.",
    paragraphs: [],
    stories: [],
    photos: [],
    videos: [],
    wireTerms: [],
  },
  {
    slug: "bitcoin",
    label: "Bitcoin",
    kicker: "Bitcoin desk",
    headline: "Bitcoin",
    dek: "Coverage of Bitcoin, mining, ETF flows, treasury buyers, and the monetary debate around BTC.",
    paragraphs: [],
    stories: [],
    photos: [],
    videos: [],
    wireTerms: ["bitcoin", "btc"],
  },
  {
    slug: "regulation",
    label: "Regulation",
    kicker: "Policy desk",
    headline: "Regulation",
    dek: "SEC, CFTC, Congress, and global market-structure rules as they land on digital assets.",
    paragraphs: [],
    stories: [],
    photos: [],
    videos: [],
    wireTerms: ["regulation", "sec", "cftc", "etf"],
  },
  {
    slug: "altcoins",
    label: "Altcoins",
    kicker: "Altcoin desk",
    headline: "Altcoins",
    dek: "Ethereum, Solana, XRP, and the rest of the tape outside Bitcoin.",
    paragraphs: [],
    stories: [],
    photos: [],
    videos: [],
    wireTerms: ["ethereum", "solana", "xrp", "altcoin", "eth", "sol"],
  },
  {
    slug: "us",
    label: "US",
    kicker: "United States",
    headline: "United States",
    dek: "The Fed, Treasury, Washington, and U.S. macro that moves risk assets.",
    paragraphs: [],
    stories: [],
    photos: [],
    videos: [],
    wireTerms: ["fed", "federal reserve", "warsh", "treasury", "white house", "united states"],
  },
  {
    slug: "china",
    label: "China",
    kicker: "China desk",
    headline: "China",
    dek: "Beijing policy, markets, and the China-crypto corridor.",
    paragraphs: [],
    stories: [],
    photos: [],
    videos: [],
    wireTerms: ["china", "beijing", "pboc", "yuan"],
  },
  {
    slug: "fun-facts",
    label: "Fun Facts",
    kicker: "Notebook",
    headline: "Fun facts",
    dek: "Short notes, curiosities, and asides from the tape.",
    paragraphs: [],
    stories: [],
    photos: [],
    videos: [],
    wireTerms: ["fun", "fact", "curious"],
  },
];

export function getDeskSection(slug: string): DeskSection | undefined {
  return DESK_SECTIONS.find((section) => section.slug === slug);
}

export function isDeskSlug(slug: string): boolean {
  return DESK_SECTIONS.some((section) => section.slug === slug);
}
