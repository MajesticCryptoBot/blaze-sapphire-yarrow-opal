export type CryptoFact = {
  title: string;
  body: string;
  year: string;
  source: string;
  href: string;
  /** Optional tag for humorous / lighter notes */
  tone?: "classic" | "humor";
};

/**
 * The desk's crypto notebook — the single source for the Fun Facts editions.
 *
 * House rules for this notebook:
 *   1. Every entry is strictly about crypto, the crypto market, or the
 *      technology and history directly behind it. No politics, no general
 *      history, no tech-for-tech's-sake trivia.
 *   2. Every entry carries a real source a reader can open.
 *   3. The pool is deliberately large (~100 entries) so the edition server
 *      (src/lib/fun-facts-server.ts) can slide a fresh 8-card window across it
 *      every two to three days without repeating itself for about a month.
 */
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
  // ---------------------------------------------------------------------
  // Bitcoin: history, supply, mining, market milestones
  // ---------------------------------------------------------------------
  {
    title: "Satoshi’s estimated million BTC have never moved",
    body:
      "On-chain analysts attribute roughly one million BTC to wallets Satoshi mined in the network’s first year. Not one coin has been spent — the largest untouched hoard in crypto.",
    year: "2009–",
    source: "Early mining-pattern research (Sergio Demian Lerner)",
    href: "https://nakamotoinstitute.org/",
    tone: "classic",
  },
  {
    title: "The last bitcoin is not expected before the year 2140",
    body:
      "Because the subsidy halves every 210,000 blocks, issuance tapers asymptotically. The final fractions of a coin should arrive sometime around 2140 — long after everyone reading this.",
    year: "2140",
    source: "Bitcoin protocol issuance schedule",
    href: "https://bitcoin.org/en/bitcoin-paper",
    tone: "classic",
  },
  {
    title: "Bitcoin’s first published exchange rate: $1 bought 1,309 BTC",
    body:
      "On 5 October 2009, New Liberty Standard pegged the dollar to bitcoin using the cost of the electricity to mine it. At that rate, one pizza’s worth of today’s BTC would have been millions.",
    year: "2009",
    source: "New Liberty Standard archive",
    href: "https://nakamotoinstitute.org/literature/",
    tone: "classic",
  },
  {
    title: "The first Bitcoin ATM was installed in Vancouver",
    body:
      "A Robocoin machine went live in a Waves coffee shop on 29 October 2013. Customers lined up to buy and sell BTC for cash within hours of the ribbon cutting.",
    year: "2013",
    source: "Contemporary reports / Robocoin",
    href: "https://nakamotoinstitute.org/",
    tone: "classic",
  },
  {
    title: "Mt. Gox was born as a card-trading site, not a Bitcoin exchange",
    body:
      "The name stands for “Magic: The Gathering Online eXchange.” Jed McCaleb repurposed the domain for bitcoin trading in 2010 and sold it to Mark Karpelès in 2011.",
    year: "2010",
    source: "Mt. Gox history / Wired coverage",
    href: "https://en.wikipedia.org/wiki/Mt._Gox",
    tone: "classic",
  },
  {
    title: "Mt. Gox handled 70% of all BTC trades — then vanished",
    body:
      "In February 2014 the Tokyo-based exchange suspended withdrawals and filed for bankruptcy, with roughly 850,000 client BTC missing. Its ruin defined the “not your keys” era.",
    year: "2014",
    source: "Mt. Gox bankruptcy filings",
    href: "https://en.wikipedia.org/wiki/Mt._Gox",
    tone: "classic",
  },
  {
    title: "The Bitcoin protocol itself has never been hacked",
    body:
      "Exchanges, bridges, and sloppy contracts have lost fortunes — but the Bitcoin ledger’s consensus rules have run unbroken since 2009. Every “Bitcoin hack” headline was really somebody else’s keys.",
    year: "2009–",
    source: "Bitcoin protocol track record",
    href: "https://bitcoin.org/en/bitcoin-paper",
    tone: "classic",
  },
  {
    title: "Satoshi’s last public words came in December 2010",
    body:
      "The final forum post, dated 12 December 2010, concerned a bug in Bitcoin 0.3.19. In March 2011 an email to Mike Hearn simply said Satoshi had “moved on to other things.”",
    year: "2010–2011",
    source: "Bitcointalk archive / Nakamoto Institute emails",
    href: "https://nakamotoinstitute.org/",
    tone: "classic",
  },
  {
    title: "Bitcoin’s market cap crossed $1 trillion in early 2021",
    body:
      "Twelve years after the genesis block, the network’s monetary base joined the trillion-dollar club — faster than almost any asset in modern financial history.",
    year: "2021",
    source: "Market data, January 2021",
    href: "https://coinmarketcap.com/currencies/bitcoin/",
    tone: "classic",
  },
  {
    title: "There are 100 million satoshis in one bitcoin",
    body:
      "The smallest unit, the sat, is named after the pseudonymous founder. It keeps the ledger usable even if a single BTC ever costs more than a house.",
    year: "2009–",
    source: "Bitcoin protocol units",
    href: "https://bitcoin.org/en/bitcoin-paper",
    tone: "classic",
  },
  {
    title: "Around a fifth of all bitcoin may be lost forever",
    body:
      "Chainalysis estimates roughly 3–4 million BTC are stranded in inaccessible wallets — burned keys, discarded drives, forgotten passwords. The effective supply is much smaller than the headline cap.",
    year: "2020–",
    source: "Chainalysis research",
    href: "https://www.chainalysis.com/",
    tone: "classic",
  },
  {
    title: "The first halving turned miners’ 50 BTC into 25",
    body:
      "On 28 November 2012, block 210,000 cut the subsidy for the first time. Markets barely knew what to make of it; the “halving cycle” was born that night.",
    year: "2012",
    source: "Bitcoin block 210,000",
    href: "https://bitcoin.org/en/bitcoin-paper",
    tone: "classic",
  },
  {
    title: "Difficulty adjusts every two weeks, like clockwork",
    body:
      "Every 2,016 blocks the network re-tunes mining difficulty to hold the ten-minute heartbeat. Miners unplugging in one country simply makes the remaining hash rate slightly richer.",
    year: "2009–",
    source: "Bitcoin consensus rules",
    href: "https://bitcoin.org/en/bitcoin-paper",
    tone: "classic",
  },
  {
    title: "SHA-256, Bitcoin’s hashing engine, was designed by the NSA",
    body:
      "The algorithm behind Bitcoin’s proof of work was published by the U.S. National Security Agency in 2001. Satoshi picked a government-designed cipher to protect a government-independent money.",
    year: "2001 / 2009",
    source: "NIST FIPS 180-2",
    href: "https://csrc.nist.gov/publications/detail/fips/180/4/final",
    tone: "classic",
  },
  {
    title: "In 2014 one mining pool flirted with 50% of the network",
    body:
      "GHash.IO briefly approached half of all hash rate, prompting outcry and a public pledge from the pool to cap itself. The scare kick-started today’s more distributed mining map.",
    year: "2014",
    source: "Contemporary network monitoring",
    href: "https://ccaf.io/cbnsi/cbeci",
    tone: "classic",
  },
  {
    title: "China’s 2021 mining ban rewired the entire network",
    body:
      "When provinces outlawed mining in mid-2021, hash rate collapsed by half within weeks — then fully recovered months later from the U.S., Kazakhstan, and beyond. No downtime at all.",
    year: "2021",
    source: "Cambridge CBECI migration data",
    href: "https://ccaf.io/cbnsi/cbeci",
    tone: "classic",
  },
  {
    title: "El Salvador made bitcoin legal tender in 2021",
    body:
      "The law took effect 7 September 2021, making El Salvador the first country to grant BTC official currency status alongside the U.S. dollar.",
    year: "2021",
    source: "El Salvador Bitcoin Law",
    href: "https://en.wikipedia.org/wiki/Bitcoin_in_El_Salvador",
    tone: "classic",
  },
  {
    title: "Taproot gave Bitcoin smarter spending in 2021",
    body:
      "The November 2021 upgrade made multisig and Lightning transactions cheaper and more private, letting complex spends look like ordinary ones on-chain.",
    year: "2021",
    source: "Bitcoin Taproot activation",
    href: "https://bitcoinops.org/",
    tone: "classic",
  },
  {
    title: "A backup seed is 12 or 24 words from a 2,048-word list",
    body:
      "BIP-39 turned private keys into memorizable phrases. The order of words is everything — and the same words in a different order protect a completely different wallet.",
    year: "2013–",
    source: "BIP-39 specification",
    href: "https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki",
    tone: "classic",
  },
  {
    title: "“Not your keys, not your coins” is a survival rule, not a slogan",
    body:
      "Every major exchange collapse — Gox, Quadriga, FTX — ended with the same lesson: custodial balances are promises, self-custodied keys are property.",
    year: "2014–",
    source: "Exchange-failure history",
    href: "https://en.wikipedia.org/wiki/Mt._Gox",
    tone: "classic",
  },
  {
    title: "Running a full node takes one machine and a few hundred gigabytes",
    body:
      "Thousands of volunteers worldwide keep independent copies of the whole ledger. Every node re-verifies every rule — that is how consensus survives without a referee.",
    year: "2009–",
    source: "Bitcoin node network",
    href: "https://bitcoin.org/en/full-node",
    tone: "classic",
  },
  {
    title: "Your private key space dwarfs the grains of sand on Earth",
    body:
      "A Bitcoin key is 256 bits: about 1.16 × 10^77 possibilities, versus roughly 10^19 grains of sand. Guessing a specific wallet is not “hard” — it is physically hopeless.",
    year: "2009–",
    source: "Cryptography fundamentals",
    href: "https://en.wikipedia.org/wiki/256-bit_computing",
    tone: "classic",
  },
  {
    title: "Namecoin was Bitcoin’s first fork",
    body:
      "Launched in April 2011, Namecoin adapted Bitcoin’s code for decentralized .bit domain names — the first proof that the codebase could spawn entire new networks.",
    year: "2011",
    source: "Namecoin project history",
    href: "https://en.wikipedia.org/wiki/Namecoin",
    tone: "classic",
  },
  {
    title: "The Bitcoin white paper fits in nine pages",
    body:
      "The entire theoretical foundation of the trillion-dollar asset class is shorter than most quarterly earnings reports — prose, diagrams, and a toy transaction model included.",
    year: "2008",
    source: "Bitcoin white paper",
    href: "https://bitcoin.org/bitcoin.pdf",
    tone: "classic",
  },
  {
    title: "Bitcoin Core has been built by more than a thousand volunteers",
    body:
      "The reference software is open source, MIT-licensed, and reviewed by independent maintainers. No company owns it; no board can rewrite its monetary policy.",
    year: "2009–",
    source: "Bitcoin Core repository",
    href: "https://github.com/bitcoin/bitcoin",
    tone: "classic",
  },
  {
    title: "ProShares’ futures ETF set a speed record in 2021",
    body:
      "BITO, the first U.S. bitcoin futures ETF, gathered $1 billion in about two days after launching 19 October 2021 — the fastest ETF launch in history at the time.",
    year: "2021",
    source: "ProShares / contemporary fund data",
    href: "https://www.proshares.com/",
    tone: "classic",
  },
  {
    title: "BlackRock’s IBIT became the fastest-growing ETF ever recorded",
    body:
      "Within its first year, the iShares Bitcoin Trust crossed $50 billion in assets faster than any fund in history — Wall Street demand for BTC exposure shocked even veterans.",
    year: "2024",
    source: "Fund flow reports, 2024",
    href: "https://www.ishares.com/us/products/333011/ishares-bitcoin-trust-etf",
    tone: "classic",
  },
  {
    title: "Spot Ether ETFs followed in July 2024",
    body:
      "Eight months after Bitcoin’s, the SEC authorized spot Ether exchange-traded funds, and they began trading on 23 July 2024 — the second crypto commodity on U.S. exchange rails.",
    year: "2024",
    source: "U.S. SEC approvals, July 2024",
    href: "https://www.sec.gov/",
    tone: "classic",
  },
  {
    title: "The U.S. created a Strategic Bitcoin Reserve in 2025",
    body:
      "A March 2025 executive order kept the government’s seized bitcoin — roughly 200,000 BTC — as a strategic reserve instead of auctioning it, converting enforcement seizures into a national stockpile.",
    year: "2025",
    source: "Executive order, March 2025",
    href: "https://en.wikipedia.org/wiki/Strategic_Bitcoin_Reserve",
    tone: "classic",
  },
  // ---------------------------------------------------------------------
  // Ethereum & smart contracts
  // ---------------------------------------------------------------------
  {
    title: "Vitalik Buterin wrote the Ethereum white paper at 19",
    body:
      "In late 2013, a teenage Bitcoin Magazine writer sketched a platform for general-purpose smart contracts. The draft became the second-largest crypto network.",
    year: "2013",
    source: "Ethereum white paper / ethereum.org",
    href: "https://ethereum.org/en/whitepaper/",
    tone: "classic",
  },
  {
    title: "Ethereum’s crowdsale raised ~$18 million in bitcoin",
    body:
      "The July–August 2014 sale collected about 31,500 BTC from buyers worldwide — one of the first global crowdfundings of a software protocol, years before “ICO” was a household term.",
    year: "2014",
    source: "Ethereum Foundation archives",
    href: "https://ethereum.org/en/history/",
    tone: "classic",
  },
  {
    title: "Ethereum’s genesis block is dated 30 July 2015",
    body:
      "The “Frontier” release went live that day, switching on mining and the first smart contracts. Everything from DeFi to NFTs runs on rails laid then.",
    year: "2015",
    source: "Ethereum history / ethereum.org",
    href: "https://ethereum.org/en/history/",
    tone: "classic",
  },
  {
    title: "ERC-20 quietly standardized the entire token economy",
    body:
      "Proposed in November 2015 by Fabian Vogelsteller and Vitalik Buterin, the ERC-20 interface let any token plug into any wallet or exchange. Thousands of ICOs stood on this one standard.",
    year: "2015",
    source: "EIP-20 specification",
    href: "https://eips.ethereum.org/EIPS/eip-20",
    tone: "classic",
  },
  {
    title: "The DAO hack split Ethereum in two",
    body:
      "In June 2016 an attacker drained ~3.6 million ETH from The DAO. The community hard-forked to reverse it; dissenters kept the original chain alive as Ethereum Classic.",
    year: "2016",
    source: "Ethereum history / EIP archive",
    href: "https://ethereum.org/en/history/",
    tone: "classic",
  },
  {
    title: "CryptoKitties once clogged the whole network",
    body:
      "At its December 2017 peak, the collectible-cat game accounted for a huge share of Ethereum transactions and exposed the scaling limits that later fueled rollup research.",
    year: "2017",
    source: "CryptoKitties launch coverage",
    href: "https://en.wikipedia.org/wiki/CryptoKitties",
    tone: "classic",
  },
  {
    title: "EIP-1559 turned Ethereum fees into a burn mechanism",
    body:
      "The August 2021 London upgrade introduced a base fee that is destroyed rather than paid to miners — making ETH supply responsive to network demand.",
    year: "2021",
    source: "EIP-1559 / Ethereum Foundation",
    href: "https://eips.ethereum.org/EIPS/eip-1559",
    tone: "classic",
  },
  {
    title: "The Merge cut Ethereum’s energy use by ~99.95%",
    body:
      "On 15 September 2022 Ethereum switched from mining to proof of stake in one coordinated switchover — a software migration executed live on a network holding hundreds of billions.",
    year: "2022",
    source: "Ethereum Foundation",
    href: "https://ethereum.org/en/roadmap/merge/",
    tone: "classic",
  },
  {
    title: "Ethereum has had deflationary stretches since the Merge",
    body:
      "With fee burning outrunning new issuance during busy periods, total ETH supply has sometimes shrunk week over week — the “ultrasound money” thesis in action.",
    year: "2022–",
    source: "Ethereum supply dashboards",
    href: "https://ultrasound.money/",
    tone: "classic",
  },
  {
    title: "Ethereum Name Service turned addresses into .eth names",
    body:
      "Launched in 2019, ENS maps human-readable names to wallet addresses, so payments go to “alice.eth” instead of a 42-character hex string.",
    year: "2019",
    source: "ENS / ens.domains",
    href: "https://ens.domains/",
    tone: "classic",
  },
  {
    title: "Roughly a quarter of all ETH is locked in staking",
    body:
      "Since the Merge, holders deposit ETH to secure the network for yield. Tens of millions of ETH sit in the staking contract — capital that simply cannot be sold instantly.",
    year: "2022–",
    source: "Ethereum staking dashboards",
    href: "https://ethereum.org/en/staking/",
    tone: "classic",
  },
  {
    title: "Ethereum fees are priced in gwei — a billionth of an ETH",
    body:
      "Like satoshis for bitcoin, gwei lets users bid in tidy numbers. A busy market hour can push a swap’s fee above a quiet weekend’s entire contract deployment.",
    year: "2015–",
    source: "Ethereum gas economics",
    href: "https://ethereum.org/en/developers/docs/gas/",
    tone: "classic",
  },
  {
    title: "Ethereum calls itself a “world computer” — and means it",
    body:
      "Instead of just tracking balances, the network executes arbitrary programs on every node. Lending markets, exchanges, and games all run as the same kind of code.",
    year: "2015–",
    source: "Ethereum white paper",
    href: "https://ethereum.org/en/whitepaper/",
    tone: "classic",
  },
  {
    title: "Layer 2 rollups execute trades, then file receipts to Ethereum",
    body:
      "Networks like Arbitrum, Optimism, and Base batch thousands of transactions off-chain and post compressed proofs home — exchange-scale speed with Ethereum-grade settlement.",
    year: "2021–",
    source: "Ethereum L2 docs",
    href: "https://ethereum.org/en/layer-2/",
    tone: "classic",
  },
  // ---------------------------------------------------------------------
  // Stablecoins & DeFi
  // ---------------------------------------------------------------------
  {
    title: "Tether launched in 2014 under the name Realcoin",
    body:
      "Rebranded within months, the dollar-pegged token grew into the most-traded asset in crypto — on many days more USDT changes hands than all other stablecoins combined.",
    year: "2014",
    source: "Tether company history",
    href: "https://tether.to/",
    tone: "classic",
  },
  {
    title: "DAI began life as “Sai” in December 2017",
    body:
      "MakerDAO’s single-collateral stablecoin launched that December, letting anyone lock ETH and mint dollar exposure without a bank — the blueprint for on-chain money.",
    year: "2017",
    source: "MakerDAO documentation",
    href: "https://makerdao.com/",
    tone: "classic",
  },
  {
    title: "USDC arrived in 2018 from Circle and Coinbase",
    body:
      "The Centre consortium’s regulated stablecoin gave U.S. institutions a compliant dollar rail and became the default settlement token for many exchanges and DeFi protocols.",
    year: "2018",
    source: "Circle / Centre consortium",
    href: "https://www.circle.com/usdc",
    tone: "classic",
  },
  {
    title: "TerraUSD’s 2022 collapse erased over $40 billion in a week",
    body:
      "The algorithmic stablecoin lost its dollar peg on 9 May 2022; its sister token LUNA hyperinflated toward zero. The wreckage triggered a chain of lenders’ failures that autumn.",
    year: "2022",
    source: "Terra collapse post-mortems",
    href: "https://en.wikipedia.org/wiki/Terra_(blockchain)",
    tone: "classic",
  },
  {
    title: "“DeFi Summer” started with a governance token airdrop",
    body:
      "In June 2020 Compound began distributing COMP to users, igniting a yield-farming frenzy. Locked value in DeFi grew from under a billion dollars to tens of billions within a year.",
    year: "2020",
    source: "Compound / DeFi Pulse history",
    href: "https://en.wikipedia.org/wiki/Decentralized_finance",
    tone: "classic",
  },
  {
    title: "Uniswap proved a smart contract could be a stock exchange",
    body:
      "The automated market maker, first deployed in November 2018, replaced order books with a formula. Its design now underpins hundreds of copies across every chain.",
    year: "2018",
    source: "Uniswap docs / v1 announcement",
    href: "https://uniswap.org/",
    tone: "classic",
  },
  {
    title: "Stablecoins settle trillions of dollars a year",
    body:
      "Dollar tokens move more value annually than many card networks — most of it invisible retail plumbing: trading, remittances, and payouts between workers and exchanges.",
    year: "2024–",
    source: "Stablecoin settlement research",
    href: "https://www.theblock.co/data/stablecoins",
    tone: "classic",
  },
  // ---------------------------------------------------------------------
  // NFTs & digital collectibles
  // ---------------------------------------------------------------------
  {
    title: "The first NFT is usually credited to 2014",
    body:
      "Kevin McCoy minted “Quantum,” an animated octagon, on Namecoin in May 2014 — three years before the ERC-721 standard made NFTs a household acronym.",
    year: "2014",
    source: "Quantum / Sotheby’s provenance notes",
    href: "https://en.wikipedia.org/wiki/Non-fungible_token",
    tone: "classic",
  },
  {
    title: "CryptoPunks were given away for free",
    body:
      "In June 2017 Larva Labs released 10,000 pixel characters to anyone with an Ethereum wallet. Years later some single Punks traded for more than a Manhattan apartment.",
    year: "2017",
    source: "Larva Labs / CryptoPunks",
    href: "https://en.wikipedia.org/wiki/CryptoPunks",
    tone: "classic",
  },
  {
    title: "A collage sold for $69 million at a 254-year-old auction house",
    body:
      "Beeple’s “Everydays: The First 5000 Days” fetched $69,346,250 at Christie’s on 11 March 2021 — the moment NFTs crossed from forum culture into fine art.",
    year: "2021",
    source: "Christie’s sale records",
    href: "https://en.wikipedia.org/wiki/Everydays:_the_First_5000_Days",
    tone: "classic",
  },
  {
    title: "Jack Dorsey’s first tweet sold as an NFT for $2.9 million",
    body:
      "The 2006 message “just setting up my twttr” went under the hammer in March 2021, a nine-year-old sentence suddenly priced like a sports car.",
    year: "2021",
    source: "Valuable auction, March 2021",
    href: "https://en.wikipedia.org/wiki/Non-fungible_token",
    tone: "classic",
  },
  {
    title: "ERC-721 exists because cats and punks demanded it",
    body:
      "After CryptoKitties and CryptoPunks proved demand for unique items, the 2018 standard gave every token an identity — the plumbing beneath the whole NFT market.",
    year: "2018",
    source: "EIP-721 specification",
    href: "https://eips.ethereum.org/EIPS/eip-721",
    tone: "classic",
  },
  // ---------------------------------------------------------------------
  // Exchanges, market structure & security history
  // ---------------------------------------------------------------------
  {
    title: "Coinbase listed on the stock exchange with an ~$86 billion valuation",
    body:
      "On 14 April 2021 the 2012-era startup went public via direct listing on Nasdaq under “COIN” — the day Wall Street priced a crypto exchange alongside banks and brokers.",
    year: "2021",
    source: "Nasdaq listing, April 2021",
    href: "https://en.wikipedia.org/wiki/Coinbase",
    tone: "classic",
  },
  {
    title: "Binance went from zero to the world’s largest exchange in about a year",
    body:
      "Founded by Changpeng Zhao in mid-2017 after a $15 million ICO, Binance outgrew every incumbent within roughly 180 days of launch — in the middle of China’s exchange crackdown.",
    year: "2017",
    source: "Binance company history",
    href: "https://en.wikipedia.org/wiki/Binance",
    tone: "classic",
  },
  {
    title: "FTX imploded in November 2022 — and its founder got 25 years",
    body:
      "The exchange filed for bankruptcy on 11 November 2022 with an ~$8 billion hole in customer funds. Sam Bankman-Fried was convicted a year later and sentenced in March 2024.",
    year: "2022–2024",
    source: "U.S. DOJ case records",
    href: "https://en.wikipedia.org/wiki/FTX",
    tone: "classic",
  },
  {
    title: "CME launched bitcoin futures on the exact top of the 2017 bull run",
    body:
      "The contracts debuted 17 December 2017 — the same day spot BTC printed its cycle high near $20,000. Traders still argue the launch marked the bell.",
    year: "2017",
    source: "CME Group launch records",
    href: "https://www.cmegroup.com/",
    tone: "classic",
  },
  {
    title: "A dead founder’s missing keys froze $190 million",
    body:
      "When QuadrigaCX’s CEO died in December 2018, the exchange said only he held the cold-wallet keys. The wallets turned out empty; the exchange owed users around $190 million.",
    year: "2019",
    source: "OSC / court filings on QuadrigaCX",
    href: "https://en.wikipedia.org/wiki/QuadrigaCX",
    tone: "classic",
  },
  {
    title: "Coincheck lost $530 million and stayed open for business",
    body:
      "In January 2018 hackers pulled half a billion dollars of NEM from the Japanese exchange’s hot wallet. It remains one of the largest thefts ever repaid to users in fiat.",
    year: "2018",
    source: "Coincheck / FSA disclosures",
    href: "https://en.wikipedia.org/wiki/Coincheck",
    tone: "classic",
  },
  {
    title: "The $611 million Poly Network hacker gave almost everything back",
    body:
      "In August 2021 an attacker drained the cross-chain protocol, then returned the funds within days — calling it an exploit to expose the flaw. Crypto’s strangest bank robbery.",
    year: "2021",
    source: "Poly Network incident reports",
    href: "https://en.wikipedia.org/wiki/Poly_Network",
    tone: "classic",
  },
  {
    title: "The Ronin bridge hack topped $600 million",
    body:
      "In March 2022 attackers used stolen validator keys to drain the network behind Axie Infinity — about $620 million, at the time the largest DeFi exploit on record.",
    year: "2022",
    source: "Ronin post-mortem",
    href: "https://en.wikipedia.org/wiki/Ronin_Network",
    tone: "classic",
  },
  {
    title: "Bybit’s 2025 breach set the all-time record: ~$1.5 billion",
    body:
      "In February 2025 attackers manipulated a signing interface and walked away with roughly 400,000 ETH — the single largest crypto theft ever recorded, in under an hour.",
    year: "2025",
    source: "Bybit security incident, February 2025",
    href: "https://www.bybit.com/",
    tone: "classic",
  },
  {
    title: "Crypto never closes — there is no closing bell",
    body:
      "Markets trade 24/7/365, weekends and holidays included. Bitcoin’s price was discovered on Christmas Day, New Year’s Eve, and every date in between since 2010.",
    year: "2010–",
    source: "Market structure",
    href: "https://coinmarketcap.com/",
    tone: "classic",
  },
  // ---------------------------------------------------------------------
  // Altcoins & memecoins
  // ---------------------------------------------------------------------
  {
    title: "Dogecoin was built in about two hours",
    body:
      "In December 2013 Billy Markus forked Litecoin and shipped the joke coin Jackson Palmer had tweeted about. It has since outlived thousands of “serious” projects.",
    year: "2013",
    source: "Dogecoin history / dogecoin.com",
    href: "https://dogecoin.com/",
    tone: "classic",
  },
  {
    title: "Dogecoin once sponsored an actual NASCAR stock car",
    body:
      "In 2014 the community crowdfunded driver Josh Wise’s #98 Ford, wrapped in Shiba Inu livery, and sent it around Talladega — possibly the fastest a memecoin has ever moved.",
    year: "2014",
    source: "NASCAR / Dogecoin foundation",
    href: "https://en.wikipedia.org/wiki/Dogecoin",
    tone: "humor",
  },
  {
    title: "Dogecoin also sent Jamaica’s bobsled team to the Olympics",
    body:
      "When the underdog team qualified for Sochi 2014 without funding, DOGE holders raised about $30,000 in a day. The sport-of-kings met the meme-of-the-people.",
    year: "2014",
    source: "Dogecoin Foundation fundraising",
    href: "https://en.wikipedia.org/wiki/Dogecoin",
    tone: "classic",
  },
  {
    title: "In May 2021 a joke coin briefly ranked among the top five assets",
    body:
      "Dogecoin peaked near $0.73 on 8 May 2021, giving it a larger market value than many S&P 500 companies — for a coin with no supply cap and an infinite emission schedule.",
    year: "2021",
    source: "Market data, May 2021",
    href: "https://coinmarketcap.com/currencies/dogecoin/",
    tone: "classic",
  },
  {
    title: "Litecoin minted the “silver to bitcoin’s gold” phrase",
    body:
      "Charlie Lee’s 2011 fork sped up blocks to 2.5 minutes and capped supply at 84 million — the template nearly every early altcoin would copy.",
    year: "2011",
    source: "Litecoin project",
    href: "https://litecoin.org/",
    tone: "classic",
  },
  {
    title: "XRP’s ledger premined its entire 100 billion supply",
    body:
      "Launched in 2012 with no mining at all, the XRP Ledger validated payments through independent servers — an early bet that banks, not miners, might move value on-chain.",
    year: "2012",
    source: "XRP Ledger docs",
    href: "https://xrpl.org/",
    tone: "classic",
  },
  {
    title: "A court split “programmatic sales” from securities law in 2023",
    body:
      "In July 2023 Judge Analisa Torres ruled that XRP sold on exchanges to retail buyers were not, in themselves, securities — reshaping how U.S. courts read token sales.",
    year: "2023",
    source: "SEC v. Ripple, S.D.N.Y. ruling",
    href: "https://en.wikipedia.org/wiki/SEC_v._Ripple_Labs",
    tone: "classic",
  },
  // ---------------------------------------------------------------------
  // Regulation & global milestones (crypto market history)
  // ---------------------------------------------------------------------
  {
    title: "Japan was the first major economy to legalize bitcoin payments",
    body:
      "An April 2017 amendment to Japan’s Payment Services Act recognized BTC as legal payment — making Tokyo the first government to give crypto a real regulatory home.",
    year: "2017",
    source: "Japan Payment Services Act",
    href: "https://en.wikipedia.org/wiki/Legality_of_bitcoin_by_country",
    tone: "classic",
  },
  {
    title: "China’s 2017 ICO ban instantly redrew the global market",
    body:
      "On 4 September 2017 Beijing outlawed token sales and shut domestic exchanges. Trading migrated overseas within weeks — and the industry globalized almost overnight.",
    year: "2017",
    source: "PBOC announcement, September 2017",
    href: "https://en.wikipedia.org/wiki/Legality_of_bitcoin_by_country",
    tone: "classic",
  },
  {
    title: "The EU’s MiCA rulebook became fully applicable in December 2024",
    body:
      "The Markets in Crypto-Assets regulation gave 27 countries one licensing regime for exchanges, custodians, and stablecoins — the largest single market to standardize crypto.",
    year: "2024",
    source: "European Commission — MiCA",
    href: "https://finance.ec.europa.eu/regulation-and-supervision/financial-services-legislation/implementing-and-delegated-acts/crypto-assets-regulation_en",
    tone: "classic",
  },
  // ---------------------------------------------------------------------
  // Humor & lighter notes — still strictly crypto
  // ---------------------------------------------------------------------
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
    href: "https://en.wikipedia.org/wiki/James_Howells",
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
    title: "A single banner ad once said “Magic Internet Money”",
    body:
      "In February 2013 a community-funded Reddit banner drew tens of thousands of new users to r/Bitcoin. Two words and a wizard did more marketing than most venture budgets.",
    year: "2013",
    source: "Reddit r/Bitcoin history",
    href: "https://www.reddit.com/r/Bitcoin/",
    tone: "humor",
  },
  {
    title: "Laser eyes took over the internet in 2021",
    body:
      "Thousands of profile pictures added glowing red pupils to push bitcoin past $100,000. The campaign trended worldwide; the timeline looked like a sci-fi convention.",
    year: "2021",
    source: "Twitter lore, 2021",
    href: "https://www.reddit.com/r/Bitcoin/",
    tone: "humor",
  },
  {
    title: "WAGMI, NGMI: the market compressed finance into four letters",
    body:
      "“We’re all gonna make it” started as encouragement on crypto Twitter; its dark twin, “not gonna make it,” now judges everything from weak hands to bad roadmap decisions.",
    year: "2021",
    source: "Crypto Twitter glossary",
    href: "https://www.investopedia.com/",
    tone: "humor",
  },
  {
    title: "“When Lambo?” is the market’s favorite financial plan",
    body:
      "Ask a crypto trader when a token will succeed and you may get a single word: “Lambo.” The supercar became the community’s shorthand for having made it — measurement unit included.",
    year: "2018–",
    source: "Crypto community lore",
    href: "https://www.investopedia.com/",
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
  {
    title: "“Diamond hands” versus “paper hands” decided loyalty in 2021",
    body:
      "Holding through chaos earned you diamonds; selling early got you tissue paper. The emoji economy peaked when memes started moving actual positions faster than earnings calls.",
    year: "2021",
    source: "Retail trading lore",
    href: "https://www.investopedia.com/",
    tone: "humor",
  },
  {
    title: "On-chain detectives track “whales” like celebrity jets",
    body:
      "A single 2011-era wallet moving can trend within minutes, with thousand-strong threads speculating about breakfast purchases. Nobody knows the whale. Everybody watches it.",
    year: "2017–",
    source: "On-chain analytics culture",
    href: "https://www.chainalysis.com/",
    tone: "humor",
  },
  {
    title: "“To the moon” outlived every rocket emoji shortage",
    body:
      "Nobody knows who first aimed a coin at lunar orbit, but by 2013 the rocket had become crypto’s default forecast. Analysts now call 100x moves “mooning” in serious research notes.",
    year: "2013–",
    source: "Crypto community glossary",
    href: "https://www.investopedia.com/",
    tone: "humor",
  },
];

/**
 * Client-side fallback rotation, used when the /api/fun-facts endpoint is
 * unreachable. Rotates the notebook by ISO week so the section never shows
 * the exact same set forever. The server (src/lib/fun-facts-server.ts) is
 * the primary source — every fact it serves comes from this crypto-only pool.
 */
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
