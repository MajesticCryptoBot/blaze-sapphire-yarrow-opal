import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { R as notFound, _ as Link, f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, v as useRouter, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Search, t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/news-BH8bq5mC.js
var ARTICLES = [
	{
		slug: "warsh-hawkish-jackson-hole",
		tag: "NEW",
		headline: "Warsh’s hawkish stance raises September rate-hike probability; nonfarm payrolls and CPI will be decisive",
		dek: "Markets re-priced the September FOMC after Kevin Warsh’s Jackson Hole remarks, lifting the implied chance of a 25 basis-point hike as two remaining data prints become the last checkpoints.",
		category: "Macro",
		publishedAt: "2026-08-29T06:40:00.000Z",
		tickers: [
			"DXY",
			"UST10Y",
			"SPX",
			"BTC"
		],
		flags: ["US"],
		related: [
			"anthropic-ipo-prospectus",
			"kospi-intraday-drop",
			"bitcoin-treasury-correction"
		],
		keyFacts: [
			{
				label: "Sept. hike odds",
				value: "~50% (from ~30%)"
			},
			{
				label: "Hike size priced",
				value: "25 bp"
			},
			{
				label: "Next prints",
				value: "NFP, CPI"
			},
			{
				label: "Speaker",
				value: "Kevin Warsh"
			}
		],
		body: [
			"Kevin Warsh’s Jackson Hole remarks were read as more hawkish than markets had discounted. StoneX market analyst Fawad Razaqzada said the Friday-evening comments were “quite hawkish,” even as Warsh declined to pre-commit to a September increase.",
			"On forward guidance, Warsh restated a position markets expected: he does not believe in traditional forward guidance and therefore refused to lock in a September hike in advance. That refusal did not stop traders from treating a return of tightening as a live scenario.",
			"On inflation, Warsh said fighting inflation remains a clear priority and discussed the path of core inflation in some detail, while adding that he is confident core inflation is moving toward the Federal Reserve’s target. The overall tone was firmer than the pre-speech consensus.",
			"During the remarks, markets sharply re-priced September policy. The implied probability of a 25 basis-point hike jumped from about 30% to around 50%. Before the September meeting, the calendar still includes a nonfarm payrolls report and a CPI print, plus several secondary releases.",
			"Under a new chair, the Fed is described as more data-dependent. Recent U.S. employment reports have missed expectations by a wide margin; any further weakening could quickly unwind the newly priced hike odds."
		]
	},
	{
		slug: "nvidia-openai-500b-data-center",
		tag: "BREAKING",
		headline: "Nvidia and OpenAI plan a $500 billion AI data-center project at 10GW scale that could become the world’s largest",
		dek: "The proposed campus would pair Nvidia’s accelerator stack with OpenAI’s training demand in a 10-gigawatt build that, if executed, would dwarf existing hyperscale clusters.",
		category: "AI Infrastructure",
		publishedAt: "2026-07-27T16:23:00.000Z",
		tickers: [
			"NVDA",
			"MSFT",
			"ORCL"
		],
		flags: ["US"],
		related: [
			"nvidia-sutskever-lab",
			"anthropic-ipo-prospectus",
			"photonics-marvell-rally"
		],
		keyFacts: [
			{
				label: "Project value",
				value: "$500 billion"
			},
			{
				label: "Power scale",
				value: "10 GW"
			},
			{
				label: "Partners",
				value: "Nvidia, OpenAI"
			},
			{
				label: "Status",
				value: "Planning"
			}
		],
		body: [
			"Nvidia and OpenAI are advancing plans for a U.S. AI data-center project valued at about $500 billion, with a designed power envelope of 10 gigawatts. If built at that scale, the campus would rank among the largest computing facilities ever proposed.",
			"The project is framed as a response to the power and cluster-size constraints now binding frontier model training. A 10GW envelope implies multi-year grid interconnection, generation, and cooling work well beyond a conventional hyperscale hall.",
			"Nvidia would supply the accelerator architecture; OpenAI would be the anchor tenant for training and inference. Additional offtake from other labs is possible but has not been confirmed.",
			"Investors will watch permitting, power contracts, and capital structure. A project of this size typically requires a mix of corporate equity, project finance, and long-dated offtake rather than a single balance-sheet check.",
			"The announcement sits inside a broader Nvidia-OpenAI industrial pairing that already includes chips, networking, and software. Execution risk remains high: timelines for 10GW of firm power in the United States are measured in years, not quarters."
		]
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
		related: [
			"nvidia-openai-500b-data-center",
			"anthropic-ipo-prospectus",
			"photonics-marvell-rally"
		],
		keyFacts: [
			{
				label: "Investor",
				value: "Nvidia"
			},
			{
				label: "Lab",
				value: "Sutskever SI lab"
			},
			{
				label: "Scale",
				value: "Billions of USD"
			},
			{
				label: "Theme",
				value: "Frontier compute"
			}
		],
		body: [
			"Nvidia is investing billions of dollars in the superintelligence laboratory led by Ilya Sutskever. The check extends Nvidia’s role from supplier of training chips to strategic capital partner of a new frontier lab.",
			"Sutskever, a co-founder of OpenAI, has positioned the lab around long-horizon research rather than near-term product cycles. Nvidia’s involvement is consistent with a strategy of seeding multiple demand centers for its accelerators.",
			"Terms were not fully disclosed. Industry practice for lab financings of this size typically mixes primary equity with reserved compute, which would further bind the lab’s cluster plans to Nvidia’s roadmap.",
			"The investment lands alongside Nvidia’s larger industrial push with OpenAI on data-center capacity. Together they signal that capital, power, and chips—not only model architecture—are the binding constraints in 2026."
		]
	},
	{
		slug: "anthropic-ipo-prospectus",
		tag: "NEW",
		headline: "Anthropic plans to file its IPO prospectus after U.S. Labor Day, with a possible listing from late September to early October",
		dek: "The AI company may disclose its S-1 after September 7 and is weighing a structure that lets existing shareholders sell stock alongside a longer-than-usual lock-up.",
		category: "Markets",
		publishedAt: "2026-08-28T02:10:00.000Z",
		tickers: [
			"ANTH",
			"MSFT",
			"GOOGL"
		],
		flags: ["US"],
		related: [
			"nvidia-openai-500b-data-center",
			"nvidia-sutskever-lab",
			"grayscale-zcash-etf"
		],
		keyFacts: [
			{
				label: "Filing window",
				value: "After 7 Sep 2026"
			},
			{
				label: "Listing window",
				value: "Late Sep–early Oct"
			},
			{
				label: "Prior step",
				value: "Confidential SEC filing"
			},
			{
				label: "Lock-up",
				value: "May exceed 180 days"
			}
		],
		body: [
			"Anthropic plans to publicly disclose its IPO prospectus after the U.S. Labor Day holiday on September 7, with a possible listing in late September or early October. The company had already submitted a confidential listing application to the U.S. Securities and Exchange Commission earlier this year.",
			"The firm is considering allowing existing shareholders to sell a portion of their holdings in the offering. It is also studying a lock-up longer than the traditional 180-day window, a structure sometimes used when employee and early-investor overhang is large.",
			"If the listing proceeds, it would be another large IPO in the AI sector and would compete with OpenAI for public-market attention. Valuation, remaining private capital, and the path to operating leverage will dominate the roadshow.",
			"Public-market investors will focus on revenue mix between API and enterprise contracts, compute costs, and concentration of cloud partners. A longer lock-up would be read as an attempt to stabilize the aftermarket rather than a signal on fundamentals alone."
		]
	},
	{
		slug: "solana-breaks-100",
		tag: "JUST IN",
		headline: "Solana breaks above $100, up more than 5% in 24 hours",
		dek: "SOL cleared the $100 handle and last traded near $100.16, extending a session gain of about 5.4% on HTX data.",
		category: "Crypto",
		publishedAt: "2026-08-25T00:12:00.000Z",
		tickers: [
			"SOL",
			"BTC",
			"ETH"
		],
		related: [
			"solana-supply-tightening",
			"bitcoin-treasury-correction",
			"whale-hype-position"
		],
		keyFacts: [
			{
				label: "Last",
				value: "$100.16"
			},
			{
				label: "24h change",
				value: "+5.42%"
			},
			{
				label: "Level",
				value: "$100"
			},
			{
				label: "Source print",
				value: "HTX"
			}
		],
		body: [
			"Solana rose through $100, last changing hands at $100.16, with a 24-hour gain of 5.42% according to HTX market data on August 25.",
			"The $100 handle is a widely watched round number for SOL after a multi-month range. A close above the level would be treated by systematic desks as a momentum confirmation; a swift rejection would leave a failed breakout on the session chart.",
			"Spot volumes typically expand around round-number breaks as both trend-following and mean-reversion flows collide. Liquidation maps on perpetual venues often cluster just beyond such handles.",
			"Broader crypto beta remained constructive into the print, with bitcoin and large-cap alts providing a supportive tape rather than a risk-off backdrop."
		]
	},
	{
		slug: "solana-supply-tightening",
		tag: "NEW",
		headline: "Solana supply-tightening proposals lag the one-third turnout threshold, with community participation still below 17%",
		dek: "SGP-0002 and SGP-0003 aim to slow issuance and raise fee burns, but both votes remain well short of the 33% participation bar.",
		category: "Crypto",
		publishedAt: "2026-08-25T00:46:00.000Z",
		tickers: ["SOL"],
		related: [
			"solana-breaks-100",
			"cosmos-evm-security",
			"whale-hype-position"
		],
		keyFacts: [
			{
				label: "SGP-0002 turnout",
				value: "16.71%"
			},
			{
				label: "SGP-0003 turnout",
				value: "13.53%"
			},
			{
				label: "Pass bar",
				value: "1/3 participation"
			},
			{
				label: "Issuance cut (est.)",
				value: "~18.9M SOL / 6y"
			}
		],
		body: [
			"The Solana community is advancing SGP-0002 and SGP-0003, two governance proposals designed to tighten SOL supply through slower issuance and higher burns. Both are in the voting stage and remain below the one-third participation threshold required to pass.",
			"SGP-0003 (mechanism SIMD-0553) would introduce a resource-based transaction-fee design. Fees would scale with network resources consumed. The change is estimated to lift daily SOL burns from about 650 coins (roughly $65,000) to 7,500–9,000 coins (about $750,000–$900,000).",
			"SGP-0002 (mechanism SIMD-0550) would double the speed of the inflation decline, bringing the 1.5% terminal inflation target forward to 2029 from 2032. Over six years the proposal is estimated to reduce issuance by about 18.9 million SOL, or roughly $1.89 billion at recent prices.",
			"SGP-0002 turnout stood at 16.71% (16.24% for, 0.31% against, 0.16% abstain). SGP-0003 turnout was 13.53% (13.23% for, 0.27% against, 0.03% abstain). Outcome still depends on whether participation can be lifted before the votes close."
		]
	},
	{
		slug: "bitcoin-treasury-correction",
		tag: "NEW",
		headline: "Bitcoin correction hits treasury companies as TD Cowen cuts Nakamoto",
		dek: "A drawdown in bitcoin is feeding through to listed treasury vehicles, with TD Cowen lowering its view on Nakamoto as equity beta to BTC remains elevated.",
		category: "Crypto",
		publishedAt: "2026-07-27T16:19:00.000Z",
		tickers: ["BTC", "MSTR"],
		related: [
			"solana-breaks-100",
			"grayscale-zcash-etf",
			"canada-farmer-tariffs"
		],
		keyFacts: [
			{
				label: "Asset",
				value: "Bitcoin"
			},
			{
				label: "Channel",
				value: "Treasury equities"
			},
			{
				label: "Broker",
				value: "TD Cowen"
			},
			{
				label: "Name cited",
				value: "Nakamoto"
			}
		],
		body: [
			"A bitcoin correction is pressuring companies that hold BTC as a treasury reserve. TD Cowen lowered its stance on Nakamoto as the equity complex that trades as a leveraged claim on bitcoin repriced lower with the coin.",
			"Treasury vehicles typically amplify spot moves because of operating leverage, financing costs, and the premium or discount at which the stock trades versus net asset value. When BTC falls, that premium often compresses at the same time NAV declines.",
			"The tape is a reminder that corporate bitcoin strategies are mark-to-market businesses in public markets, even when management describes holdings as long-duration reserves.",
			"Flows into spot bitcoin ETFs and the path of real yields remain the two variables most desks will watch for a stabilization in the treasury-equity complex."
		]
	},
	{
		slug: "grayscale-zcash-etf",
		tag: "NEW",
		headline: "Grayscale Zcash spot ETF ZCSH opens 1.83% higher in U.S. trading, last at $65.85",
		dek: "The newly listed product started the U.S. cash session in the green, giving ZEC a listed wrapper alongside larger crypto ETFs.",
		category: "Crypto",
		publishedAt: "2026-08-25T13:04:00.000Z",
		tickers: [
			"ZEC",
			"BTC",
			"ETH"
		],
		flags: ["US"],
		related: [
			"bitcoin-treasury-correction",
			"solana-breaks-100",
			"anthropic-ipo-prospectus"
		],
		keyFacts: [
			{
				label: "Ticker",
				value: "ZCSH"
			},
			{
				label: "Open change",
				value: "+1.83%"
			},
			{
				label: "Last",
				value: "$65.85"
			},
			{
				label: "Issuer",
				value: "Grayscale"
			}
		],
		body: [
			"Grayscale’s Zcash spot ETF, ticker ZCSH, opened 1.83% higher in U.S. cash trading and last changed hands at $65.85, according to BIT market data on August 25.",
			"A listed ZEC wrapper gives traditional accounts a way to hold the asset without wallets or prime-brokerage crypto rails. First-session prints are often noisy; sustained volume and creation/redemption activity will matter more than the open.",
			"Privacy-coin ETFs face a stricter compliance overlay than bitcoin or ether products. Authorized participants, banks, and index desks will watch whether creations remain smooth after the first week.",
			"Price discovery in ZCSH will be compared with offshore ZEC perpetuals. Persistent premiums or discounts would signal that the wrapper is still bedding in."
		]
	},
	{
		slug: "cosmos-evm-security",
		tag: "ALERT",
		headline: "Cosmos Labs: security incident in the Cosmos EVM module; validators advised to pause chain operation",
		dek: "A continuing incident has affected users of the Cosmos EVM module. Cosmos Labs has told connected EVM chains that validators should halt until the event is contained.",
		category: "Crypto",
		publishedAt: "2026-08-25T00:14:00.000Z",
		tickers: ["ATOM"],
		related: [
			"solana-supply-tightening",
			"whale-hype-position",
			"solana-breaks-100"
		],
		keyFacts: [
			{
				label: "Issuer",
				value: "Cosmos Labs"
			},
			{
				label: "Surface",
				value: "Cosmos EVM module"
			},
			{
				label: "Guidance",
				value: "Pause validator ops"
			},
			{
				label: "Report",
				value: "After containment"
			}
		],
		body: [
			"Cosmos Labs said a continuing security incident has affected users of the Cosmos EVM module. The firm’s security and engineering teams have been responding to the event.",
			"Cosmos Labs advised Cosmos EVM chains in contact with the team that validators should pause chain operation. An incident report is expected after the situation is resolved.",
			"Halting validators is a containment step used when a module-level bug could allow inconsistent state or fund movement. Downstream DeFi on affected EVM chains may see frozen finality until a patch is coordinated.",
			"Holders of ATOM and app-chain tokens should treat on-chain messages from validators as the operational source of truth until Cosmos Labs publishes the post-incident report."
		]
	},
	{
		slug: "kospi-intraday-drop",
		tag: "NEW",
		headline: "South Korea’s KOSPI drops 4% on the day; Samsung Electronics and SK Hynix slide",
		dek: "The benchmark fell 4.00% intraday, with Samsung Electronics down 4% and SK Hynix down 6% on Bitget market data.",
		category: "Equities",
		publishedAt: "2026-08-25T00:18:00.000Z",
		tickers: [
			"KS11",
			"005930.KS",
			"000660.KS",
			"NVDA"
		],
		flags: ["KR"],
		related: [
			"photonics-marvell-rally",
			"nvidia-openai-500b-data-center",
			"warsh-hawkish-jackson-hole"
		],
		keyFacts: [
			{
				label: "KOSPI",
				value: "−4.00%"
			},
			{
				label: "Samsung Electronics",
				value: "−4%"
			},
			{
				label: "SK Hynix",
				value: "−6%"
			},
			{
				label: "Tape",
				value: "Intraday"
			}
		],
		body: [
			"South Korea’s KOSPI index dropped 4.00% on the day, according to Bitget market data on August 25. Samsung Electronics fell 4% and SK Hynix fell 6%.",
			"Memory and foundry names have been trading as a high-beta claim on the AI capex cycle. A 4% index move with Hynix underperforming is consistent with a de-risking of that trade rather than an idiosyncratic Korea story alone.",
			"Global desks will map the session against Nvidia, U.S. semis, and the dollar-won cross. Persistent won weakness often amplifies local-equity drawdowns for foreign holders.",
			"If the move is driven by positioning rather than a local policy shock, follow-through in U.S. hours will be the confirmation. A rebound in U.S. semiconductor futures would argue for a dip rather than a regime change."
		]
	},
	{
		slug: "photonics-marvell-rally",
		tag: "NEW",
		headline: "U.S. photonics stocks rally broadly, with Marvell Technology up more than 6%",
		dek: "The photonics complex advanced in U.S. trading, led by Marvell, as investors continued to pay up for optical and connectivity exposure tied to AI clusters.",
		category: "Equities",
		publishedAt: "2026-08-25T13:07:00.000Z",
		tickers: [
			"MRVL",
			"NVDA",
			"AVGO",
			"COHR"
		],
		flags: ["US"],
		related: [
			"nvidia-openai-500b-data-center",
			"kospi-intraday-drop",
			"nvidia-sutskever-lab"
		],
		keyFacts: [
			{
				label: "Marvell",
				value: "+6%+"
			},
			{
				label: "Complex",
				value: "Photonics"
			},
			{
				label: "Driver",
				value: "AI interconnect"
			},
			{
				label: "Session",
				value: "U.S. cash"
			}
		],
		body: [
			"U.S. photonics stocks rose broadly, with Marvell Technology gaining more than 6%, according to BIT market data on August 25.",
			"Optical transceivers, DSPs, and switch silicon have become a second-order AI trade: cluster scale is now limited as much by networking as by GPUs. Marvell sits in that stack.",
			"Broad rallies in a narrow theme often fade unless they are backed by order commentary or capex revisions. The next catalyst set is hyperscaler commentary on 1.6T optics and custom XPUs.",
			"Positioning in the group is crowded relative to 2024. A 6% single-name pop is large enough to force both momentum adding and systematic rebalancing in the same session."
		]
	},
	{
		slug: "canada-farmer-tariffs",
		tag: "JUST IN",
		headline: "President Trump says Canada charges U.S. farmers 400% tariffs",
		dek: "The remark puts agricultural protection back on the U.S.–Canada trade tape and will be parsed against existing dairy and poultry tariff-rate quotas.",
		category: "Geopolitics",
		publishedAt: "2026-08-25T13:14:00.000Z",
		tickers: [
			"CAD",
			"WEAT",
			"DBA"
		],
		flags: ["US", "CA"],
		related: [
			"warsh-hawkish-jackson-hole",
			"kospi-intraday-drop",
			"bitcoin-treasury-correction"
		],
		keyFacts: [
			{
				label: "Claim",
				value: "400% tariffs"
			},
			{
				label: "Target",
				value: "U.S. farmers"
			},
			{
				label: "Counterparty",
				value: "Canada"
			},
			{
				label: "Speaker",
				value: "President Trump"
			}
		],
		body: [
			"President Trump said Canada charges U.S. farmers tariffs of 400%. The comment immediately reopened the agricultural chapter of U.S.–Canada trade politics.",
			"Canada’s supply-management system for dairy, poultry, and eggs uses tariff-rate quotas. Over-quota rates on some dairy lines can reach several hundred percent, which is the factual core usually cited in this argument.",
			"Markets will treat the remark as a political signal rather than a new legal instrument until a notice, executive action, or USMCA process is published. CAD and ag futures are the first-order tapes.",
			"Any move from speech to policy would hit processors and retailers on both sides of the border. For now the statement is a headline risk, not a confirmed tariff schedule change."
		]
	},
	{
		slug: "whale-hype-position",
		tag: "NEW",
		headline: "A whale hedging HYPE shifts to a unilateral bullish position, buying $14.2 million across spot and futures at the same time",
		dek: "On-chain flow shows the desk dropped a hedge and built a one-way long, splitting size between cash and perpetual markets.",
		category: "Crypto",
		publishedAt: "2026-08-27T08:27:00.000Z",
		tickers: ["HYPE", "BTC"],
		related: [
			"solana-breaks-100",
			"solana-supply-tightening",
			"grayscale-zcash-etf"
		],
		keyFacts: [
			{
				label: "Notional",
				value: "$14.2 million"
			},
			{
				label: "Asset",
				value: "HYPE"
			},
			{
				label: "Structure",
				value: "Spot + futures"
			},
			{
				label: "Stance",
				value: "Unilateral long"
			}
		],
		body: [
			"A large account that had been hedging HYPE flipped to a one-sided bullish book, purchasing $14.2 million across spot and futures at the same time.",
			"Simultaneous spot and perpetual buying is typically used to build directional exposure while keeping basis risk in-house. It is more aggressive than a cash-only accumulation and more visible on both CEX and on-chain prints.",
			"HYPE’s order books are thinner than large-cap majors, so $14.2 million is large relative to average depth. Slippage and subsequent copy-flow can extend the move after the initial prints.",
			"Copy-trading desks will watch whether the account adds on dips or distributes into strength. A failed follow-through after a hedge flip is a common fade setup in mid-cap tokens."
		]
	},
	{
		slug: "quantum-calibration-model",
		tag: "NEW",
		headline: "Nvidia launches a quantum-computing AI calibration model for automatic tuning of quantum computers",
		dek: "The model is designed to auto-tune quantum hardware and is framed as a step toward tighter AI–quantum integration in the lab stack.",
		category: "AI",
		publishedAt: "2026-07-27T15:10:00.000Z",
		tickers: [
			"NVDA",
			"IBM",
			"IONQ"
		],
		flags: ["US"],
		related: [
			"nvidia-openai-500b-data-center",
			"nvidia-sutskever-lab",
			"photonics-marvell-rally"
		],
		keyFacts: [
			{
				label: "Vendor",
				value: "Nvidia"
			},
			{
				label: "Domain",
				value: "Quantum calibration"
			},
			{
				label: "Function",
				value: "Auto-tuning"
			},
			{
				label: "Theme",
				value: "AI–quantum"
			}
		],
		body: [
			"Nvidia launched an AI calibration model for quantum computers, intended to tune hardware automatically and reduce the manual calibration load that currently sits with lab operators.",
			"Calibration drift is one of the operational bottlenecks in superconducting and trapped-ion systems. An AI tuner that can hold gates in spec would be a practical, if incremental, piece of the stack rather than a qubit-count breakthrough.",
			"The product extends Nvidia’s positioning that GPU-class classical compute remains essential around quantum processors for control, simulation, and error-mitigation workloads.",
			"Commercial impact will depend on whether the model is adopted inside existing control stacks at IBM, IonQ, and national labs, or remains a reference implementation."
		]
	}
];
var CATEGORIES = [
	"All",
	"Macro",
	"Crypto",
	"AI",
	"AI Infrastructure",
	"Equities",
	"Markets",
	"Geopolitics"
];
function getArticle(slug) {
	return ARTICLES.find((a) => a.slug === slug);
}
function getRelated(article) {
	return article.related.map((slug) => getArticle(slug)).filter((a) => Boolean(a));
}
function formatTime(iso) {
	return new Date(iso).toLocaleString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "UTC",
		hour12: false
	});
}
function telegramCaption(article) {
	return `${article.tag}: ${article.headline}`;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-B73hrHL6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-16 border-t border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-lg",
				children: "Alpha Signals Pro"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-md text-sm text-muted",
				children: "Professional market wire for crypto, macro, and AI. Headlines are rewritten for the Telegram desk; this site carries the full brief."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] uppercase tracking-[0.14em] text-subtle",
				children: "Not investment advice · Desk copy only"
			})]
		})
	});
}
function SiteHeader() {
	const [now, setNow] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
		return () => clearInterval(id);
	}, []);
	const stamp = now.toLocaleString("en-GB", {
		weekday: "short",
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZone: "UTC",
		hour12: false
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-border bg-bg/92 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-3 min-h-11",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-8 items-center justify-center rounded-sm bg-primary text-primary-foreground font-display text-sm font-semibold",
						children: "A"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-[17px] font-medium tracking-tight",
							children: "Alpha Signals Pro"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-mono text-[10px] uppercase tracking-[0.18em] text-muted",
							children: "Market intelligence"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-1 md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "flex h-11 items-center px-3 text-sm text-muted hover:text-foreground",
							children: "Wire"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/markets",
							className: "flex h-11 items-center px-3 text-sm text-muted hover:text-foreground",
							children: "Markets"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#desk",
							className: "flex h-11 items-center px-3 text-sm text-muted hover:text-foreground",
							children: "Desk"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "flex size-11 items-center justify-center text-muted hover:text-foreground md:hidden",
						"aria-label": "Home",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden text-right sm:block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
							children: "UTC"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[11px] tabular-nums text-muted",
							children: stamp
						})]
					})]
				})
			]
		})
	});
}
var TICKERS = [
	{
		symbol: "BTC",
		name: "Bitcoin",
		price: 78894.58,
		change: -1.12,
		spark: [
			81,
			80,
			79.2,
			78.4,
			79.1,
			78.9,
			78.7
		]
	},
	{
		symbol: "ETH",
		name: "Ether",
		price: 2941.2,
		change: .84,
		spark: [
			2.86,
			2.88,
			2.9,
			2.87,
			2.92,
			2.94,
			2.94
		]
	},
	{
		symbol: "SOL",
		name: "Solana",
		price: 100.16,
		change: 5.42,
		spark: [
			92,
			93.4,
			94.1,
			96.8,
			98.2,
			99.4,
			100.2
		]
	},
	{
		symbol: "XRP",
		name: "XRP",
		price: 1.4458,
		change: .62,
		spark: [
			1.41,
			1.42,
			1.43,
			1.44,
			1.43,
			1.44,
			1.45
		]
	},
	{
		symbol: "NVDA",
		name: "Nvidia",
		price: 178.42,
		change: 2.31,
		spark: [
			168,
			170,
			172,
			171,
			174,
			176,
			178
		]
	},
	{
		symbol: "GOLD",
		name: "Gold",
		price: 2486.1,
		change: .41,
		spark: [
			2468,
			2472,
			2475,
			2471,
			2479,
			2483,
			2486
		]
	},
	{
		symbol: "DXY",
		name: "US Dollar",
		price: 104.28,
		change: .18,
		spark: [
			103.9,
			104,
			104.1,
			104.05,
			104.2,
			104.22,
			104.28
		]
	},
	{
		symbol: "UST10Y",
		name: "US 10Y",
		price: 4.31,
		change: .06,
		spark: [
			4.18,
			4.21,
			4.22,
			4.25,
			4.28,
			4.3,
			4.31
		]
	}
];
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function TickerBar() {
	const loop = [...TICKERS, ...TICKERS];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-y border-border bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-w-max animate-[ticker_42s_linear_infinite] motion-reduce:animate-none",
				children: loop.map((t, i) => {
					const up = t.change >= 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 border-r border-border px-5 py-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] font-semibold tracking-wide text-muted",
								children: t.symbol
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[12px] tabular-nums text-foreground",
								children: t.price.toLocaleString("en-US", { maximumFractionDigits: 2 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("font-mono text-[11px] tabular-nums", up ? "text-up" : "text-down"),
								children: [
									up ? "+" : "",
									t.change.toFixed(2),
									"%"
								]
							})
						]
					}, `${t.symbol}-${i}`);
				})
			})
		})
	});
}
var styles_default = "/assets/styles-HHOQr4Xs.css";
var APP_NAME = "Alpha Signals Pro";
var Route$3 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Alpha Signals Pro — professional market intelligence for crypto, macro, and AI. Full briefs behind the Telegram wire."
			},
			{
				name: "theme-color",
				content: "#09090b"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap"
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-dvh flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TickerBar, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
					]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$2 = () => import("./routes-DVuTvGMB.mjs");
var Route$2 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./markets-Bh8m6R10.mjs");
var Route$1 = createFileRoute("/markets")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./n._slug-cdY_IvIe.mjs");
var Route = createFileRoute("/n/$slug")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	loader: ({ params }) => {
		const article = getArticle(params.slug);
		if (!article) throw notFound();
		return { article };
	},
	head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.article.tag}: ${loaderData.article.headline} · ASP` : "Alpha Signals Pro" }] })
});
var rootRouteChildren = {
	IndexRoute: Route$2.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	MarketsRoute: Route$1.update({
		id: "/markets",
		path: "/markets",
		getParentRoute: () => Route$3
	}),
	NSlugRoute: Route.update({
		id: "/n/$slug",
		path: "/n/$slug",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { ARTICLES as a, getRelated as c, TICKERS as i, telegramCaption as l, Route as n, CATEGORIES as o, cn as r, formatTime as s, router_exports as t };
