export type CryptoFact = {
  title: string;
  body: string;
  year: string;
  source: string;
  href: string;
  /** Optional tag for humorous / lighter notes */
  tone?: "classic" | "humor";
};

/** Expanded notebook. Classic sourced notes + light humoristic crypto stories. */
export const CRYPTO_FACTS: CryptoFact[] = [
  {
    title: "The 21 million cap is in the code, not a press release",
    body:
      "Satoshi’s 2008 white paper describes a predetermined, declining issuance schedule. The 21 million BTC ceiling is enforced by consensus rules, not by a company charter.",
    year: "2008",
    source: "Bitcoin white paper, bitcoin.org",
    href: "https://bitcoin.org/bitcoin.pdf",
    tone: "classic",
  },
  {
    title: "The genesis block is timestamped 3 January 2009",
    body:
      "Block 0 embeds a Times headline about a second bank bailout. The chain has run without a reset since that block.",
    year: "2009",
    source: "Nakamoto Institute / genesis block",
    href: "https://nakamotoinstitute.org/bitcoin/",
    tone: "classic",
  },
  {
    title: "Issuance halves about every 210,000 blocks",
    body:
      "Subsidy cuts in 2012, 2016, 2020 and 2024 dropped the block reward from 50 BTC toward 3.125 BTC. The next halving is expected around 2028.",
    year: "2012–2024",
    source: "Bitcoin protocol / bitcoin.org",
    href: "https://bitcoin.org/en/bitcoin-paper",
    tone: "classic",
  },
  {
    title: "The first known commercial BTC purchase was two pizzas",
    body:
      "On 22 May 2010, Laszlo Hanyecz paid 10,000 BTC for two Papa John’s pizzas in Jacksonville. The day is still marked as Bitcoin Pizza Day.",
    year: "2010",
    source: "Bitcointalk archive via Nakamoto Institute literature",
    href: "https://nakamotoinstitute.org/literature/",
    tone: "classic",
  },
  {
    title: "Cambridge tracks Bitcoin’s electricity use in public",
    body:
      "The Cambridge Bitcoin Electricity Consumption Index (CBECI) publishes an open model of network power demand. It is the standard academic reference, not an exchange blog.",
    year: "2019–",
    source: "Cambridge Centre for Alternative Finance",
    href: "https://ccaf.io/cbnsi/cbeci",
    tone: "classic",
  },
  {
    title: "A block is found roughly every ten minutes",
    body:
      "Difficulty retargets every 2,016 blocks so that average block time stays near 10 minutes, even as hash rate rises or falls.",
    year: "2009–",
    source: "Bitcoin white paper, section 4",
    href: "https://bitcoin.org/bitcoin.pdf",
    tone: "classic",
  },
  {
    title: "U.S. spot Bitcoin ETFs opened in January 2024",
    body:
      "The SEC authorized spot Bitcoin exchange-traded products in January 2024, moving BTC exposure onto the same rails as listed equities.",
    year: "2024",
    source: "U.S. Securities and Exchange Commission",
    href: "https://www.sec.gov/newsroom/press-releases/2024-7",
    tone: "classic",
  },
  {
    title: "Primary sources live at the Nakamoto Institute",
    body:
      "The Institute hosts Satoshi’s emails, forum posts, and the white paper without recap or trading commentary — the cleanest public archive for Bitcoin history.",
    year: "2013–",
    source: "Nakamoto Institute",
    href: "https://nakamotoinstitute.org/",
    tone: "classic",
  },
  // Additional classic facts
  {
    title: "Bitcoin’s first transaction was 10 BTC to Hal Finney",
    body:
      "On 12 January 2009, Satoshi sent 10 BTC to Hal Finney in the first peer-to-peer transfer on the network. Finney later became one of the earliest public advocates.",
    year: "2009",
    source: "Nakamoto Institute / early transactions",
    href: "https://nakamotoinstitute.org/bitcoin/",
    tone: "classic",
  },
  {
    title: "The white paper was published on Halloween 2008",
    body:
      "Satoshi posted the nine-page Bitcoin white paper to the cryptography mailing list on 31 October 2008 — a quiet debut that would later reshape finance.",
    year: "2008",
    source: "Bitcoin white paper, bitcoin.org",
    href: "https://bitcoin.org/bitcoin.pdf",
    tone: "classic",
  },
  {
    title: "SegWit activated in August 2017",
    body:
      "Segregated Witness soft-forked onto the network in August 2017, fixing transaction malleability and enabling second-layer designs such as Lightning.",
    year: "2017",
    source: "Bitcoin protocol history",
    href: "https://bitcoin.org/en/bitcoin-paper",
    tone: "classic",
  },
  {
    title: "The Lightning Network is a payment channel network",
    body:
      "Lightning lets users open payment channels off-chain and settle net results on Bitcoin. It was first proposed in a 2015 paper and has grown into a live routing network.",
    year: "2015–",
    source: "Lightning Network white paper lineage",
    href: "https://lightning.network/",
    tone: "classic",
  },
  // Humoristic / lighter crypto stories
  {
    title: "Someone once paid 10,000 BTC for pizza — and the internet never forgot",
    body:
      "Laszlo’s 2010 pizza order became the ultimate “I should have held” meme. Every year on 22 May the community celebrates (or mourns) the most expensive takeout in history.",
    year: "2010",
    source: "Bitcoin Pizza Day lore",
    href: "https://nakamotoinstitute.org/literature/",
    tone: "humor",
  },
  {
    title: "The lost hard drive that may contain thousands of BTC",
    body:
      "In 2013 a Welsh man threw away a hard drive that allegedly held 7,500 BTC. Landfill searches and dramatic documentaries followed — the coins remain missing, the meme lives forever.",
    year: "2013",
    source: "Public reports / community lore",
    href: "https://nakamotoinstitute.org/",
    tone: "humor",
  },
  {
    title: "Dogecoin started as a joke and still refuses to die",
    body:
      "Created in late 2013 as a light-hearted alternative to Bitcoin, Dogecoin survived a near-death experience, celebrity tweets, and more cycles than most serious projects. Humor is surprisingly durable infrastructure.",
    year: "2013",
    source: "Dogecoin history",
    href: "https://dogecoin.com/",
    tone: "humor",
  },
  {
    title: "“HODL” was born from a drunk forum post",
    body:
      "In 2013 a Bitcointalk user typed “I AM HODLING” during a chaotic price swing. The typo stuck, became a mantra, and now appears on merchandise, conference stages, and corporate balance sheets.",
    year: "2013",
    source: "Bitcointalk archive",
    href: "https://bitcointalk.org/",
    tone: "humor",
  },
  {
    title: "Crypto Twitter once turned a simple tweet into a market event",
    body:
      "A single influential account can still move prices in minutes. The running joke is that the most powerful trading algorithm in crypto is still “someone with a blue check and a phone.”",
    year: "2017–",
    source: "Market folklore",
    href: "https://bitcoin.org/",
    tone: "humor",
  },
  {
    title: "The “few” who understood became a meme",
    body:
      "A 2017-era illustration of a lonely figure looking out over a city captioned “few understand this” became the unofficial mascot of every bull market. Irony and genuine conviction still share the same image.",
    year: "2017",
    source: "Crypto meme archive",
    href: "https://nakamotoinstitute.org/",
    tone: "humor",
  },
  {
    title: "Exchange outages are the unofficial market holiday",
    body:
      "Whenever volatility spikes, a familiar pattern appears: charts freeze, support queues explode, and users invent creative new words for “maintenance.” The market’s unofficial holiday is still “the exchange is down.”",
    year: "2017–",
    source: "Trader folklore",
    href: "https://bitcoin.org/",
    tone: "humor",
  },
  {
    title: "NFT profile pictures briefly became a social status system",
    body:
      "For a short, intense period, certain pixelated animals on the blockchain functioned as digital VIP badges. The fashion cycle was shorter than most runway seasons — and far more expensive.",
    year: "2021",
    source: "NFT era lore",
    href: "https://bitcoin.org/",
    tone: "humor",
  },
];

/** Return a rotating weekly selection so the Fun Facts desk never shows the exact same set. */
export function getWeeklyFacts(count = 8): CryptoFact[] {
  if (CRYPTO_FACTS.length === 0) return [];
  const now = new Date();
  // ISO week number (approx) — stable across the year
  const start = new Date(Date.UTC(now.getFullYear(), 0, 1));
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000) + 1;
  const week = Math.floor((dayOfYear - 1) / 7);
  const offset = week % CRYPTO_FACTS.length;

  // Rotate the full list, then take a mix of classic + humor
  const rotated = [
    ...CRYPTO_FACTS.slice(offset),
    ...CRYPTO_FACTS.slice(0, offset),
  ];

  const classic = rotated.filter((f) => f.tone !== "humor");
  const humor = rotated.filter((f) => f.tone === "humor");

  // Prefer roughly 60% classic / 40% humor, fill remaining from either
  const classicTake = Math.max(1, Math.floor(count * 0.6));
  const humorTake = count - classicTake;

  const selected = [
    ...classic.slice(0, classicTake),
    ...humor.slice(0, humorTake),
  ];

  // If still short, fill from the rest of the rotated list
  if (selected.length < count) {
    for (const fact of rotated) {
      if (selected.length >= count) break;
      if (!selected.includes(fact)) selected.push(fact);
    }
  }

  return selected.slice(0, count);
}
