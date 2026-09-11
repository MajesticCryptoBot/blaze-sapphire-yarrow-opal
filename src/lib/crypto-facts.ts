export type CryptoFact = {
  title: string;
  body: string;
  year: string;
  source: string;
  href: string;
};

/** Sourced Bitcoin-era notebook. Citations are primary or academic, not recaps. */
export const CRYPTO_FACTS: CryptoFact[] = [
  {
    title: "The 21 million cap is in the code, not a press release",
    body:
      "Satoshi’s 2008 white paper describes a predetermined, declining issuance schedule. The 21 million BTC ceiling is enforced by consensus rules, not by a company charter.",
    year: "2008",
    source: "Bitcoin white paper, bitcoin.org",
    href: "https://bitcoin.org/bitcoin.pdf",
  },
  {
    title: "The genesis block is timestamped 3 January 2009",
    body:
      "Block 0 embeds a Times headline about a second bank bailout. The chain has run without a reset since that block.",
    year: "2009",
    source: "Nakamoto Institute / genesis block",
    href: "https://nakamotoinstitute.org/bitcoin/",
  },
  {
    title: "Issuance halves about every 210,000 blocks",
    body:
      "Subsidy cuts in 2012, 2016, 2020 and 2024 dropped the block reward from 50 BTC toward 3.125 BTC. The next halving is expected around 2028.",
    year: "2012–2024",
    source: "Bitcoin protocol / bitcoin.org",
    href: "https://bitcoin.org/en/bitcoin-paper",
  },
  {
    title: "The first known commercial BTC purchase was two pizzas",
    body:
      "On 22 May 2010, Laszlo Hanyecz paid 10,000 BTC for two Papa John’s pizzas in Jacksonville. The day is still marked as Bitcoin Pizza Day.",
    year: "2010",
    source: "Bitcointalk archive via Nakamoto Institute literature",
    href: "https://nakamotoinstitute.org/literature/",
  },
  {
    title: "Cambridge tracks Bitcoin’s electricity use in public",
    body:
      "The Cambridge Bitcoin Electricity Consumption Index (CBECI) publishes an open model of network power demand. It is the standard academic reference, not an exchange blog.",
    year: "2019–",
    source: "Cambridge Centre for Alternative Finance",
    href: "https://ccaf.io/cbnsi/cbeci",
  },
  {
    title: "A block is found roughly every ten minutes",
    body:
      "Difficulty retargets every 2,016 blocks so that average block time stays near 10 minutes, even as hash rate rises or falls.",
    year: "2009–",
    source: "Bitcoin white paper, section 4",
    href: "https://bitcoin.org/bitcoin.pdf",
  },
  {
    title: "U.S. spot Bitcoin ETFs opened in January 2024",
    body:
      "The SEC authorized spot Bitcoin exchange-traded products in January 2024, moving BTC exposure onto the same rails as listed equities.",
    year: "2024",
    source: "U.S. Securities and Exchange Commission",
    href: "https://www.sec.gov/newsroom/press-releases/2024-7",
  },
  {
    title: "Primary sources live at the Nakamoto Institute",
    body:
      "The Institute hosts Satoshi’s emails, forum posts, and the white paper without recap or trading commentary — the cleanest public archive for Bitcoin history.",
    year: "2013–",
    source: "Nakamoto Institute",
    href: "https://nakamotoinstitute.org/",
  },
];
