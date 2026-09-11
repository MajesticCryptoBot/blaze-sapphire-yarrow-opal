export type DeskSection = {
  slug: string;
  label: string;
  kicker: string;
  headline: string;
  dek: string;
  patterns: RegExp[];
};

export const DESK_SECTIONS: DeskSection[] = [
  {
    slug: "news",
    label: "News",
    kicker: "Newsroom",
    headline: "News",
    dek: "The full ASP tape — every brief, photo, and video as it hits the desk.",
    patterns: [],
  },
  {
    slug: "crypto",
    label: "Crypto",
    kicker: "Crypto desk",
    headline: "Crypto",
    dek: "Bitcoin, ether, alts, ETFs, whales, and the digital-asset tape.",
    patterns: [
      /\bbitcoin\b/i, /\bBTC\b/, /\bethereum\b/i, /\bether\b/i, /\bETH\b/,
      /\bsolana\b/i, /\bSOL\b/, /\bXRP\b/, /\bripple\b/i, /\bcrypto\b/i,
      /\bdefi\b/i, /\bstablecoins?\b/i, /\baltcoins?\b/i, /\bbinance\b/i,
      /\bcoinbase\b/i, /\bwhale\b/i, /\bliquidat/i, /\btoken\b/i, /\bblockchain\b/i,
    ],
  },
  {
    slug: "tech",
    label: "Tech",
    kicker: "Tech desk",
    headline: "Tech",
    dek: "Apple, Microsoft, Nvidia, and the rest of big-tech corporate tape.",
    patterns: [
      /\bapple\b/i, /\bmicrosoft\b/i, /\bnvidia\b/i, /\bgoogle\b/i, /\balphabet\b/i,
      /\bamazon\b/i, /\bmeta\b/i, /\bfacebook\b/i, /\btesla\b/i, /\bsamsung\b/i,
      /\bintel\b/i, /\bAMD\b/, /\bTSMC\b/, /\bqualcomm\b/i, /\bbroadcom\b/i,
      /\basml\b/i, /\boracle\b/i, /\bibm\b/i, /\bsalesforce\b/i, /\bhuawei\b/i,
      /\bsony\b/i, /\btim\s+cook\b/i, /\bjensen\s+huang\b/i,
    ],
  },
  {
    slug: "ai",
    label: "AI",
    kicker: "AI desk",
    headline: "AI",
    dek: "Models, labs, and new artificial-intelligence features as they ship.",
    patterns: [
      /\bartificial\s+intelligence\b/i, /\bai\b/i, /\bopenai\b/i, /\banthropic\b/i,
      /\bchatgpt\b/i, /\bclaude\b/i, /\bgemini\b/i, /\bgrok\b/i, /\bxai\b/i,
      /\bdeepseek\b/i, /\bllm\b/i, /\blanguage\s+model\b/i, /\bsuperintelligence\b/i,
      /\bcopilot\b/i, /\bgenerative\s+ai\b/i,
    ],
  },
  {
    slug: "stocks",
    label: "Stocks",
    kicker: "Equities desk",
    headline: "Stocks",
    dek: "Earnings, listings, indexes, and the cash equity tape — not crypto tokens.",
    patterns: [
      /\bearnings\b/i, /\bIPO\b/, /\bstocks?\b/i, /\bshares?\b/i, /\bequit(?:y|ies)\b/i,
      /\bNASDAQ\b/i, /\bNYSE\b/, /\bS&P\b/, /\bdow\s+jones\b/i, /\bwall\s+street\b/i,
      /\bdividend\b/i, /\bbuyback\b/i, /\bbstocks?\b/i,
    ],
  },
  {
    slug: "innovation",
    label: "Innovation",
    kicker: "Lab notes",
    headline: "Innovation",
    dek: "Future ideas, prototypes, and breakthroughs — not routine product news.",
    patterns: [
      /\binnovation\b/i, /\bbreakthrough\b/i, /\bprototype\b/i,
      /\bnext[- ]gen(?:eration)?\b/i, /\binvention\b/i, /\bpatent\b/i, /\bR&D\b/,
      /\bmoonshot\b/i, /\bexperimental\b/i, /\bfuture\s+of\b/i,
    ],
  },
  {
    slug: "bitcoin",
    label: "Bitcoin",
    kicker: "Bitcoin desk",
    headline: "Bitcoin",
    dek: "BTC, ETF flows, miners, treasuries, and the monetary debate around Bitcoin.",
    patterns: [/\bbitcoin\b/i, /\bBTC\b/, /\bsatoshi\b/i, /\bordinals\b/i],
  },
  {
    slug: "ethereum",
    label: "Ethereum",
    kicker: "Ethereum desk",
    headline: "Ethereum",
    dek: "Ether, the L2 stack, staking, and Ethereum market structure.",
    patterns: [/\bethereum\b/i, /\bether\b/i, /\bETH\b/],
  },
  {
    slug: "solana",
    label: "Solana",
    kicker: "Solana desk",
    headline: "Solana",
    dek: "SOL, Solana apps, validators, and network events.",
    patterns: [/\bsolana\b/i, /\bSOL\b/],
  },
  {
    slug: "xrp",
    label: "XRP",
    kicker: "XRP desk",
    headline: "XRP",
    dek: "Ripple, XRP liquidity, and the legal tape around the token.",
    patterns: [/\bXRP\b/i, /\bripple\b/i],
  },
  {
    slug: "regulation",
    label: "Regulation",
    kicker: "Policy desk",
    headline: "Regulation",
    dek: "SEC, CFTC, ETFs, lawsuits, and market-structure rules.",
    patterns: [
      /\bregulat(?:ion|or|ory|ors)\b/i, /\b(?:the\s+)?SEC\b/, /\bCFTC\b/, /\bESMA\b/,
      /\bMiCA\b/i, /\blawsuit\b/i, /\bsubpoena\b/i, /\bsecurities\s+and\s+exchange\b/i,
      /\benforcement\s+action\b/i, /\bspot\s+etfs?\b/i,
      /\bETF\s+(?:application|approval|decision|filing)\b/i,
    ],
  },
  {
    slug: "altcoins",
    label: "Altcoins",
    kicker: "Altcoin desk",
    headline: "Altcoins",
    dek: "Ethereum, Solana, XRP, and the rest of the tape outside Bitcoin.",
    patterns: [
      /\bethereum\b/i, /\bether\b/i, /\bETH\b/, /\bsolana\b/i, /\bSOL\b/, /\bXRP\b/i,
      /\bripple\b/i, /\bdogecoin\b/i, /\bDOGE\b/, /\bcardano\b/i, /\bADA\b/,
      /\bavalanche\b/i, /\bAVAX\b/, /\bchainlink\b/i, /\baltcoins?\b/i, /\bBNB\b/,
      /\bpolygon\b/i, /\bTON\b/, /\bSUI\b/, /\bhyperliquid\b/i, /\bHYPE\b/,
    ],
  },
  {
    slug: "us",
    label: "US",
    kicker: "United States",
    headline: "United States",
    dek: "The Fed, Treasury, Washington, and U.S. macro that moves risk assets.",
    patterns: [
      /\bUnited\s+States\b/i, /\bUSA\b/, /\bU\.S\.A\.?\b/,
      /\bU\.S\.(?=\s|$|[.,;:'")\]])/, /\bthe\s+US\b/, /(?:^|[.!?]\s+|:\s+)US\b/,
      /\bUS\s+(?:dollar|dollars|Treasury|Treasuries|Fed|SEC|CFTC|stocks?|equities|markets?|lawmakers|Congress|Senate|House|government|president|election|banks?|GDP|economy|sanctions|tariffs|trade|military)\b/,
      /\bWhite\s+House\b/i, /\bWashington\b/i, /\bFederal\s+Reserve\b/i, /\bthe\s+Fed\b/i,
      /\bFOMC\b/, /\bPowell\b/, /\bWarsh\b/, /\bU\.?S\.?\s+Treasury\b/i,
      /\bTreasury\s+Department\b/i, /\bDXY\b/, /\bWall\s+Street\b/i, /\bnonfarm\b/i, /\bNFP\b/,
    ],
  },
  {
    slug: "international",
    label: "International",
    kicker: "World desk",
    headline: "International",
    dek: "Non-U.S. briefs from the tape — Europe, Asia, and the rest of the world.",
    patterns: [
      /\bchina\b/i, /\bchinese\b/i, /\bbeijing\b/i, /\brussia\b/i, /\brussian\b/i,
      /\bmoscow\b/i, /\beuropean\s+union\b/i, /\bthe\s+EU\b/i, /\bEU\b/,
      /\bunited\s+kingdom\b/i, /\bbritain\b/i, /\bthe\s+UK\b/i, /\bUK\b/,
      /\bjapan\b/i, /\bsouth\s+korea\b/i, /\bnorth\s+korea\b/i, /\bindia\b/i,
      /\bbrazil\b/i, /\biran\b/i, /\bisrael\b/i, /\bukraine\b/i, /\bgermany\b/i,
      /\bfrance\b/i, /\bcanada\b/i, /\bmexico\b/i, /\bsaudi\b/i, /\bUAE\b/,
      /\bhong\s+kong\b/i, /\btaiwan\b/i, /\bsingapore\b/i,
    ],
  },
  {
    slug: "china",
    label: "China",
    kicker: "China desk",
    headline: "China",
    dek: "Beijing policy, Chinese markets, and the China-crypto corridor.",
    patterns: [
      /\bchina\b/i, /\bchinese\b/i, /\bbeijing\b/i, /\bshanghai\b/i, /\bshenzhen\b/i,
      /\bhong\s+kong\b/i, /\bPBOC\b/, /\byuan\b/i, /\brenminbi\b/i, /\bhang\s+seng\b/i,
      /\balibaba\b/i, /\btencent\b/i, /\bbytedance\b/i,
    ],
  },
  {
    slug: "russia",
    label: "Russia",
    kicker: "Russia desk",
    headline: "Russia",
    dek: "Moscow, the ruble, and Russia-related market and crypto briefs.",
    patterns: [
      /\brussia\b/i, /\brussian\b/i, /\bmoscow\b/i, /\bkremlin\b/i, /\bputin\b/i,
      /\brubles?\b/i, /\broubles?\b/i, /\bCBR\b/, /\bgazprom\b/i,
    ],
  },
  {
    slug: "fun-facts",
    label: "Fun Facts",
    kicker: "Notebook",
    headline: "Fun facts",
    dek: "Short, sourced notes on Bitcoin and crypto history — not trading calls.",
    patterns: [/\bfun\s+facts?\b/i, /\bdid\s+you\s+know\b/i, /\btrivia\b/i, /\bpizza\s+day\b/i, /\bgenesis\s+block\b/i],
  },
  {
    slug: "videos",
    label: "Videos",
    kicker: "Video desk",
    headline: "Videos",
    dek: "Every brief on the tape that arrived with video.",
    patterns: [],
  },
];

function matchesPatterns(text: string, patterns: RegExp[]) {
  return patterns.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
}

export function matchesDesk(post: { text: string; hasVideo?: boolean }, section: DeskSection) {
  if (section.slug === "news") return true;
  if (section.slug === "videos") return Boolean(post.hasVideo);
  if (section.slug === "international") {
    const us = DESK_SECTIONS.find((item) => item.slug === "us");
    if (us && matchesPatterns(post.text, us.patterns) && !matchesPatterns(post.text, section.patterns)) {
      return false;
    }
  }
  if (section.patterns.length === 0) return false;
  return matchesPatterns(post.text, section.patterns);
}

export function getDeskSection(slug: string): DeskSection | undefined {
  return DESK_SECTIONS.find((section) => section.slug === slug);
}

export function isDeskSlug(slug: string): boolean {
  return DESK_SECTIONS.some((section) => section.slug === slug);
}
