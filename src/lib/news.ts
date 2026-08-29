export type NewsTag = "JUST IN" | "BREAKING" | "ALERT" | "NEW";

export type Article = {
  slug: string;
  tag: NewsTag;
  headline: string;
  dek: string;
  body: string[];
  tickers: string[];
  category: string;
  publishedAt: string;
  related: string[];
  flags?: string[];
  keyFacts: { label: string; value: string }[];
};

export const ARTICLES: Article[] = [
  {
    slug: "warsh-hawkish-jackson-hole",
    tag: "NEW",
    headline:
      "Warsh’s hawkish stance raises September rate-hike probability; nonfarm payrolls and CPI will be decisive",
    dek: "Markets re-priced the September FOMC after Kevin Warsh’s Jackson Hole remarks, lifting the implied chance of a 25 basis-point hike as two remaining data prints become the last checkpoints.",
    category: "Macro",
    publishedAt: "2026-08-29T06:40:00.000Z",
    tickers: ["DXY", "UST10Y", "SPX", "BTC"],
    flags: ["US"],
    related: ["anthropic-ipo-prospectus", "kospi-intraday-drop", "bitcoin-treasury-correction"],
    keyFacts: [
      { label: "Sept. hike odds", value: "~50% (from ~30%)" },
      { label: "Hike size priced", value: "25 bp" },
      { label: "Next prints", value: "NFP, CPI" },
      { label: "Speaker", value: "Kevin Warsh" },
    ],
    body: [
      "Kevin Warsh’s Jackson Hole remarks were read as more hawkish than markets had discounted. StoneX market analyst Fawad Razaqzada said the Friday-evening comments were “quite hawkish,” even as Warsh declined to pre-commit to a September increase.",
      "On forward guidance, Warsh restated a position markets expected: he does not believe in traditional forward guidance and therefore refused to lock in a September hike in advance. That refusal did not stop traders from treating a return of tightening as a live scenario.",
      "On inflation, Warsh said fighting inflation remains a clear priority and discussed the path of core inflation in some detail, while adding that he is confident core inflation is moving toward the Federal Reserve’s target. The overall tone was firmer than the pre-speech consensus.",
      "During the remarks, markets sharply re-priced September policy. The implied probability of a 25 basis-point hike jumped from about 30% to around 50%. Before the September meeting, the calendar still includes a nonfarm payrolls report and a CPI print, plus several secondary releases.",
      "Under a new chair, the Fed is described as more data-dependent. Recent U.S. employment reports have missed expectations by a wide margin; any further weakening could quickly unwind the newly priced hike odds.",
    ],
  },
  {
    slug: "nvidia-openai-500b-data-center",
    tag: "BREAKING",
    headline:
      "Nvidia and OpenAI plan a $500 billion AI data-center project at 10GW scale that could become the world’s largest",
    dek: "The proposed campus would pair Nvidia’s accelerator stack with OpenAI’s training demand in a 10-gigawatt build that, if executed, would dwarf existing hyperscale clusters.",
    category: "AI Infrastructure",
    publishedAt: "2026-07-27T16:23:00.000Z",
    tickers: ["NVDA", "MSFT", "ORCL"],
    flags: ["US"],
    related: ["nvidia-sutskever-lab", "anthropic-ipo-prospectus", "photonics-marvell-rally"],
    keyFacts: [
      { label: "Project value", value: "$500 billion" },
      { label: "Power scale", value: "10 GW" },
      { label: "Partners", value: "Nvidia, OpenAI" },
      { label: "Status", value: "Planning" },
    ],
    body: [
      "Nvidia and OpenAI are advancing plans for a U.S. AI data-center project valued at about $500 billion, with a designed power envelope of 10 gigawatts. If built at that scale, the campus would rank among the largest computing facilities ever proposed.",
      "The project is framed as a response to the power and cluster-size constraints now binding frontier model training. A 10GW envelope implies multi-year grid interconnection, generation, and cooling work well beyond a conventional hyperscale hall.",
      "Nvidia would supply the accelerator architecture; OpenAI would be the anchor tenant for training and inference. Additional offtake from other labs is possible but has not been confirmed.",
      "Investors will watch permitting, power contracts, and capital structure. A project of this size typically requires a mix of corporate equity, project finance, and long-dated offtake rather than a single balance-sheet check.",
      "The announcement sits inside a broader Nvidia-OpenAI industrial pairing that already includes chips, networking, and software. Execution risk remains high: timelines for 10GW of firm power in the United States are measured in years, not quarters.",
    ],
  },
  {
    slug: "nvidia-sutskever-lab",
    tag: "NEW",
    headline: "Nvidia invests billions in Ilya Sutskever’s superintelligence lab",
    dek: "The chipmaker is committing multi-billion-dollar capital to the research lab led by OpenAI co-founder Ilya Sutskever, tightening Nvidia’s stake in the next wave of frontier labs.",
    category: "AI",
    publishedAt: "2026-07-27T15:16:00.000Z",
    tickers: ["NVDA"],
    flags: ["US"],
    related: ["nvidia-openai-500b-data-center", "anthropic-ipo-prospectus", "photonics-marvell-rally"],
    keyFacts: [
      { label: "Investor", value: "Nvidia" },
      { label: "Lab", value: "Sutskever SI lab" },
      { label: "Scale", value: "Billions of USD" },
      { label: "Theme", value: "Frontier compute" },
    ],
    body: [
      "Nvidia is investing billions of dollars in the superintelligence laboratory led by Ilya Sutskever. The check extends Nvidia’s role from supplier of training chips to strategic capital partner of a new frontier lab.",
      "Sutskever, a co-founder of OpenAI, has positioned the lab around long-horizon research rather than near-term product cycles. Nvidia’s involvement is consistent with a strategy of seeding multiple demand centers for its accelerators.",
      "Terms were not fully disclosed. Industry practice for lab financings of this size typically mixes primary equity with reserved compute, which would further bind the lab’s cluster plans to Nvidia’s roadmap.",
      "The investment lands alongside Nvidia’s larger industrial push with OpenAI on data-center capacity. Together they signal that capital, power, and chips—not only model architecture—are the binding constraints in 2026.",
    ],
  },
  {
    slug: "anthropic-ipo-prospectus",
    tag: "NEW",
    headline:
      "Anthropic plans to file its IPO prospectus after U.S. Labor Day, with a possible listing from late September to early October",
    dek: "The AI company may disclose its S-1 after September 7 and is weighing a structure that lets existing shareholders sell stock alongside a longer-than-usual lock-up.",
    category: "Markets",
    publishedAt: "2026-08-28T02:10:00.000Z",
    tickers: ["ANTH", "MSFT", "GOOGL"],
    flags: ["US"],
    related: ["nvidia-openai-500b-data-center", "nvidia-sutskever-lab", "grayscale-zcash-etf"],
    keyFacts: [
      { label: "Filing window", value: "After 7 Sep 2026" },
      { label: "Listing window", value: "Late Sep–early Oct" },
      { label: "Prior step", value: "Confidential SEC filing" },
      { label: "Lock-up", value: "May exceed 180 days" },
    ],
    body: [
      "Anthropic plans to publicly disclose its IPO prospectus after the U.S. Labor Day holiday on September 7, with a possible listing in late September or early October. The company had already submitted a confidential listing application to the U.S. Securities and Exchange Commission earlier this year.",
      "The firm is considering allowing existing shareholders to sell a portion of their holdings in the offering. It is also studying a lock-up longer than the traditional 180-day window, a structure sometimes used when employee and early-investor overhang is large.",
      "If the listing proceeds, it would be another large IPO in the AI sector and would compete with OpenAI for public-market attention. Valuation, remaining private capital, and the path to operating leverage will dominate the roadshow.",
      "Public-market investors will focus on revenue mix between API and enterprise contracts, compute costs, and concentration of cloud partners. A longer lock-up would be read as an attempt to stabilize the aftermarket rather than a signal on fundamentals alone.",
    ],
  },
  {
    slug: "solana-breaks-100",
    tag: "JUST IN",
    headline: "Solana breaks above $100, up more than 5% in 24 hours",
    dek: "SOL cleared the $100 handle and last traded near $100.16, extending a session gain of about 5.4% on HTX data.",
    category: "Crypto",
    publishedAt: "2026-08-25T00:12:00.000Z",
    tickers: ["SOL", "BTC", "ETH"],
    related: ["solana-supply-tightening", "bitcoin-treasury-correction", "whale-hype-position"],
    keyFacts: [
      { label: "Last", value: "$100.16" },
      { label: "24h change", value: "+5.42%" },
      { label: "Level", value: "$100" },
      { label: "Source print", value: "HTX" },
    ],
    body: [
      "Solana rose through $100, last changing hands at $100.16, with a 24-hour gain of 5.42% according to HTX market data on August 25.",
      "The $100 handle is a widely watched round number for SOL after a multi-month range. A close above the level would be treated by systematic desks as a momentum confirmation; a swift rejection would leave a failed breakout on the session chart.",
      "Spot volumes typically expand around round-number breaks as both trend-following and mean-reversion flows collide. Liquidation maps on perpetual venues often cluster just beyond such handles.",
      "Broader crypto beta remained constructive into the print, with bitcoin and large-cap alts providing a supportive tape rather than a risk-off backdrop.",
    ],
  },
  {
    slug: "solana-supply-tightening",
    tag: "NEW",
    headline:
      "Solana supply-tightening proposals lag the one-third turnout threshold, with community participation still below 17%",
    dek: "SGP-0002 and SGP-0003 aim to slow issuance and raise fee burns, but both votes remain well short of the 33% participation bar.",
    category: "Crypto",
    publishedAt: "2026-08-25T00:46:00.000Z",
    tickers: ["SOL"],
    related: ["solana-breaks-100", "cosmos-evm-security", "whale-hype-position"],
    keyFacts: [
      { label: "SGP-0002 turnout", value: "16.71%" },
      { label: "SGP-0003 turnout", value: "13.53%" },
      { label: "Pass bar", value: "1/3 participation" },
      { label: "Issuance cut (est.)", value: "~18.9M SOL / 6y" },
    ],
    body: [
      "The Solana community is advancing SGP-0002 and SGP-0003, two governance proposals designed to tighten SOL supply through slower issuance and higher burns. Both are in the voting stage and remain below the one-third participation threshold required to pass.",
      "SGP-0003 (mechanism SIMD-0553) would introduce a resource-based transaction-fee design. Fees would scale with network resources consumed. The change is estimated to lift daily SOL burns from about 650 coins (roughly $65,000) to 7,500–9,000 coins (about $750,000–$900,000).",
      "SGP-0002 (mechanism SIMD-0550) would double the speed of the inflation decline, bringing the 1.5% terminal inflation target forward to 2029 from 2032. Over six years the proposal is estimated to reduce issuance by about 18.9 million SOL, or roughly $1.89 billion at recent prices.",
      "SGP-0002 turnout stood at 16.71% (16.24% for, 0.31% against, 0.16% abstain). SGP-0003 turnout was 13.53% (13.23% for, 0.27% against, 0.03% abstain). Outcome still depends on whether participation can be lifted before the votes close.",
    ],
  },
  {
    slug: "bitcoin-treasury-correction",
    tag: "NEW",
    headline: "Bitcoin correction hits treasury companies as TD Cowen cuts Nakamoto",
    dek: "A drawdown in bitcoin is feeding through to listed treasury vehicles, with TD Cowen lowering its view on Nakamoto as equity beta to BTC remains elevated.",
    category: "Crypto",
    publishedAt: "2026-07-27T16:19:00.000Z",
    tickers: ["BTC", "MSTR"],
    related: ["solana-breaks-100", "grayscale-zcash-etf", "canada-farmer-tariffs"],
    keyFacts: [
      { label: "Asset", value: "Bitcoin" },
      { label: "Channel", value: "Treasury equities" },
      { label: "Broker", value: "TD Cowen" },
      { label: "Name cited", value: "Nakamoto" },
    ],
    body: [
      "A bitcoin correction is pressuring companies that hold BTC as a treasury reserve. TD Cowen lowered its stance on Nakamoto as the equity complex that trades as a leveraged claim on bitcoin repriced lower with the coin.",
      "Treasury vehicles typically amplify spot moves because of operating leverage, financing costs, and the premium or discount at which the stock trades versus net asset value. When BTC falls, that premium often compresses at the same time NAV declines.",
      "The tape is a reminder that corporate bitcoin strategies are mark-to-market businesses in public markets, even when management describes holdings as long-duration reserves.",
      "Flows into spot bitcoin ETFs and the path of real yields remain the two variables most desks will watch for a stabilization in the treasury-equity complex.",
    ],
  },
  {
    slug: "grayscale-zcash-etf",
    tag: "NEW",
    headline: "Grayscale Zcash spot ETF ZCSH opens 1.83% higher in U.S. trading, last at $65.85",
    dek: "The newly listed product started the U.S. cash session in the green, giving ZEC a listed wrapper alongside larger crypto ETFs.",
    category: "Crypto",
    publishedAt: "2026-08-25T13:04:00.000Z",
    tickers: ["ZEC", "BTC", "ETH"],
    flags: ["US"],
    related: ["bitcoin-treasury-correction", "solana-breaks-100", "anthropic-ipo-prospectus"],
    keyFacts: [
      { label: "Ticker", value: "ZCSH" },
      { label: "Open change", value: "+1.83%" },
      { label: "Last", value: "$65.85" },
      { label: "Issuer", value: "Grayscale" },
    ],
    body: [
      "Grayscale’s Zcash spot ETF, ticker ZCSH, opened 1.83% higher in U.S. cash trading and last changed hands at $65.85, according to BIT market data on August 25.",
      "A listed ZEC wrapper gives traditional accounts a way to hold the asset without wallets or prime-brokerage crypto rails. First-session prints are often noisy; sustained volume and creation/redemption activity will matter more than the open.",
      "Privacy-coin ETFs face a stricter compliance overlay than bitcoin or ether products. Authorized participants, banks, and index desks will watch whether creations remain smooth after the first week.",
      "Price discovery in ZCSH will be compared with offshore ZEC perpetuals. Persistent premiums or discounts would signal that the wrapper is still bedding in.",
    ],
  },
  {
    slug: "cosmos-evm-security",
    tag: "ALERT",
    headline:
      "Cosmos Labs: security incident in the Cosmos EVM module; validators advised to pause chain operation",
    dek: "A continuing incident has affected users of the Cosmos EVM module. Cosmos Labs has told connected EVM chains that validators should halt until the event is contained.",
    category: "Crypto",
    publishedAt: "2026-08-25T00:14:00.000Z",
    tickers: ["ATOM"],
    related: ["solana-supply-tightening", "whale-hype-position", "solana-breaks-100"],
    keyFacts: [
      { label: "Issuer", value: "Cosmos Labs" },
      { label: "Surface", value: "Cosmos EVM module" },
      { label: "Guidance", value: "Pause validator ops" },
      { label: "Report", value: "After containment" },
    ],
    body: [
      "Cosmos Labs said a continuing security incident has affected users of the Cosmos EVM module. The firm’s security and engineering teams have been responding to the event.",
      "Cosmos Labs advised Cosmos EVM chains in contact with the team that validators should pause chain operation. An incident report is expected after the situation is resolved.",
      "Halting validators is a containment step used when a module-level bug could allow inconsistent state or fund movement. Downstream DeFi on affected EVM chains may see frozen finality until a patch is coordinated.",
      "Holders of ATOM and app-chain tokens should treat on-chain messages from validators as the operational source of truth until Cosmos Labs publishes the post-incident report.",
    ],
  },
  {
    slug: "kospi-intraday-drop",
    tag: "NEW",
    headline: "South Korea’s KOSPI drops 4% on the day; Samsung Electronics and SK Hynix slide",
    dek: "The benchmark fell 4.00% intraday, with Samsung Electronics down 4% and SK Hynix down 6% on Bitget market data.",
    category: "Equities",
    publishedAt: "2026-08-25T00:18:00.000Z",
    tickers: ["KS11", "005930.KS", "000660.KS", "NVDA"],
    flags: ["KR"],
    related: ["photonics-marvell-rally", "nvidia-openai-500b-data-center", "warsh-hawkish-jackson-hole"],
    keyFacts: [
      { label: "KOSPI", value: "−4.00%" },
      { label: "Samsung Electronics", value: "−4%" },
      { label: "SK Hynix", value: "−6%" },
      { label: "Tape", value: "Intraday" },
    ],
    body: [
      "South Korea’s KOSPI index dropped 4.00% on the day, according to Bitget market data on August 25. Samsung Electronics fell 4% and SK Hynix fell 6%.",
      "Memory and foundry names have been trading as a high-beta claim on the AI capex cycle. A 4% index move with Hynix underperforming is consistent with a de-risking of that trade rather than an idiosyncratic Korea story alone.",
      "Global desks will map the session against Nvidia, U.S. semis, and the dollar-won cross. Persistent won weakness often amplifies local-equity drawdowns for foreign holders.",
      "If the move is driven by positioning rather than a local policy shock, follow-through in U.S. hours will be the confirmation. A rebound in U.S. semiconductor futures would argue for a dip rather than a regime change.",
    ],
  },
  {
    slug: "photonics-marvell-rally",
    tag: "NEW",
    headline: "U.S. photonics stocks rally broadly, with Marvell Technology up more than 6%",
    dek: "The photonics complex advanced in U.S. trading, led by Marvell, as investors continued to pay up for optical and connectivity exposure tied to AI clusters.",
    category: "Equities",
    publishedAt: "2026-08-25T13:07:00.000Z",
    tickers: ["MRVL", "NVDA", "AVGO", "COHR"],
    flags: ["US"],
    related: ["nvidia-openai-500b-data-center", "kospi-intraday-drop", "nvidia-sutskever-lab"],
    keyFacts: [
      { label: "Marvell", value: "+6%+" },
      { label: "Complex", value: "Photonics" },
      { label: "Driver", value: "AI interconnect" },
      { label: "Session", value: "U.S. cash" },
    ],
    body: [
      "U.S. photonics stocks rose broadly, with Marvell Technology gaining more than 6%, according to BIT market data on August 25.",
      "Optical transceivers, DSPs, and switch silicon have become a second-order AI trade: cluster scale is now limited as much by networking as by GPUs. Marvell sits in that stack.",
      "Broad rallies in a narrow theme often fade unless they are backed by order commentary or capex revisions. The next catalyst set is hyperscaler commentary on 1.6T optics and custom XPUs.",
      "Positioning in the group is crowded relative to 2024. A 6% single-name pop is large enough to force both momentum adding and systematic rebalancing in the same session.",
    ],
  },
  {
    slug: "canada-farmer-tariffs",
    tag: "JUST IN",
    headline: "President Trump says Canada charges U.S. farmers 400% tariffs",
    dek: "The remark puts agricultural protection back on the U.S.–Canada trade tape and will be parsed against existing dairy and poultry tariff-rate quotas.",
    category: "Geopolitics",
    publishedAt: "2026-08-25T13:14:00.000Z",
    tickers: ["CAD", "WEAT", "DBA"],
    flags: ["US", "CA"],
    related: ["warsh-hawkish-jackson-hole", "kospi-intraday-drop", "bitcoin-treasury-correction"],
    keyFacts: [
      { label: "Claim", value: "400% tariffs" },
      { label: "Target", value: "U.S. farmers" },
      { label: "Counterparty", value: "Canada" },
      { label: "Speaker", value: "President Trump" },
    ],
    body: [
      "President Trump said Canada charges U.S. farmers tariffs of 400%. The comment immediately reopened the agricultural chapter of U.S.–Canada trade politics.",
      "Canada’s supply-management system for dairy, poultry, and eggs uses tariff-rate quotas. Over-quota rates on some dairy lines can reach several hundred percent, which is the factual core usually cited in this argument.",
      "Markets will treat the remark as a political signal rather than a new legal instrument until a notice, executive action, or USMCA process is published. CAD and ag futures are the first-order tapes.",
      "Any move from speech to policy would hit processors and retailers on both sides of the border. For now the statement is a headline risk, not a confirmed tariff schedule change.",
    ],
  },
  {
    slug: "whale-hype-position",
    tag: "NEW",
    headline:
      "A whale hedging HYPE shifts to a unilateral bullish position, buying $14.2 million across spot and futures at the same time",
    dek: "On-chain flow shows the desk dropped a hedge and built a one-way long, splitting size between cash and perpetual markets.",
    category: "Crypto",
    publishedAt: "2026-08-27T08:27:00.000Z",
    tickers: ["HYPE", "BTC"],
    related: ["solana-breaks-100", "solana-supply-tightening", "grayscale-zcash-etf"],
    keyFacts: [
      { label: "Notional", value: "$14.2 million" },
      { label: "Asset", value: "HYPE" },
      { label: "Structure", value: "Spot + futures" },
      { label: "Stance", value: "Unilateral long" },
    ],
    body: [
      "A large account that had been hedging HYPE flipped to a one-sided bullish book, purchasing $14.2 million across spot and futures at the same time.",
      "Simultaneous spot and perpetual buying is typically used to build directional exposure while keeping basis risk in-house. It is more aggressive than a cash-only accumulation and more visible on both CEX and on-chain prints.",
      "HYPE’s order books are thinner than large-cap majors, so $14.2 million is large relative to average depth. Slippage and subsequent copy-flow can extend the move after the initial prints.",
      "Copy-trading desks will watch whether the account adds on dips or distributes into strength. A failed follow-through after a hedge flip is a common fade setup in mid-cap tokens.",
    ],
  },
  {
    slug: "quantum-calibration-model",
    tag: "NEW",
    headline:
      "Nvidia launches a quantum-computing AI calibration model for automatic tuning of quantum computers",
    dek: "The model is designed to auto-tune quantum hardware and is framed as a step toward tighter AI–quantum integration in the lab stack.",
    category: "AI",
    publishedAt: "2026-07-27T15:10:00.000Z",
    tickers: ["NVDA", "IBM", "IONQ"],
    flags: ["US"],
    related: ["nvidia-openai-500b-data-center", "nvidia-sutskever-lab", "photonics-marvell-rally"],
    keyFacts: [
      { label: "Vendor", value: "Nvidia" },
      { label: "Domain", value: "Quantum calibration" },
      { label: "Function", value: "Auto-tuning" },
      { label: "Theme", value: "AI–quantum" },
    ],
    body: [
      "Nvidia launched an AI calibration model for quantum computers, intended to tune hardware automatically and reduce the manual calibration load that currently sits with lab operators.",
      "Calibration drift is one of the operational bottlenecks in superconducting and trapped-ion systems. An AI tuner that can hold gates in spec would be a practical, if incremental, piece of the stack rather than a qubit-count breakthrough.",
      "The product extends Nvidia’s positioning that GPU-class classical compute remains essential around quantum processors for control, simulation, and error-mitigation workloads.",
      "Commercial impact will depend on whether the model is adopted inside existing control stacks at IBM, IonQ, and national labs, or remains a reference implementation.",
    ],
  },
];

export const CATEGORIES = [
  "All",
  "Macro",
  "Crypto",
  "AI",
  "AI Infrastructure",
  "Equities",
  "Markets",
  "Geopolitics",
] as const;

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getRelated(article: Article) {
  return article.related
    .map((slug) => getArticle(slug))
    .filter((a): a is Article => Boolean(a));
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: false,
  });
}

export function telegramCaption(article: Article) {
  return `${article.tag}: ${article.headline}`;
}
