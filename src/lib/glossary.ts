export type GlossaryCategory = "Macro" | "Markets" | "Crypto" | "Trading" | "DeFi" | "Technology";

export type GlossaryEntry = {
  term: string;
  definition: string;
  category: GlossaryCategory;
  aliases?: string[];
};

export const GLOSSARY: GlossaryEntry[] = [
  { term: "Airdrop", definition: "A distribution of crypto tokens to eligible wallets, often used to reward users or launch a project.", category: "Crypto" },
  { term: "All-Time High (ATH)", definition: "The highest recorded price or value an asset has reached.", category: "Markets", aliases: ["ATH", "all time high"] },
  { term: "All-Time Low (ATL)", definition: "The lowest recorded price or value an asset has reached.", category: "Markets", aliases: ["ATL", "all time low"] },
  { term: "Altcoin", definition: "A cryptocurrency other than Bitcoin; the term is commonly used for non-Bitcoin crypto assets.", category: "Crypto" },
  { term: "AMM", definition: "Automated Market Maker: a decentralized exchange mechanism that prices and swaps assets using liquidity pools rather than a traditional order book.", category: "DeFi", aliases: ["Automated Market Maker"] },
  { term: "APR", definition: "Annual Percentage Rate: the simple annualized rate of return, without compounding being included in the headline figure.", category: "Markets", aliases: ["Annual Percentage Rate"] },
  { term: "APY", definition: "Annual Percentage Yield: an annualized return that accounts for compounding.", category: "Markets", aliases: ["Annual Percentage Yield"] },
  { term: "Ask", definition: "The lowest price at which a seller is currently willing to sell an asset.", category: "Trading", aliases: ["ask price"] },
  { term: "Asset", definition: "Something with economic value that can be owned or traded, such as a stock, bond, commodity or crypto asset.", category: "Markets" },
  { term: "Asset Allocation", definition: "How an investor distributes capital among different asset classes, such as stocks, bonds, cash and crypto.", category: "Markets" },
  { term: "Bear Market", definition: "A prolonged period of falling prices and generally weak market sentiment.", category: "Markets" },
  { term: "Bearish", definition: "Expecting prices or market conditions to weaken or decline.", category: "Trading" },
  { term: "Beta", definition: "A measure of how strongly an asset's price has historically moved relative to a benchmark.", category: "Markets" },
  { term: "Bid", definition: "The highest price a buyer is currently willing to pay for an asset.", category: "Trading", aliases: ["bid price"] },
  { term: "Bitcoin", definition: "The first major decentralized cryptocurrency, launched in 2009 and secured by a proof-of-work blockchain.", category: "Crypto", aliases: ["BTC"] },
  { term: "Bitcoin Dominance", definition: "Bitcoin's share of the total crypto market capitalization.", category: "Crypto", aliases: ["BTC dominance", "BTC.D"] },
  { term: "Block", definition: "A batch of blockchain transactions and related data recorded together and linked to the previous block.", category: "Crypto" },
  { term: "Blockchain", definition: "A distributed digital ledger in which records are grouped into blocks and linked cryptographically.", category: "Technology" },
  { term: "Blue Chip", definition: "A large, established company generally regarded as financially strong and relatively mature.", category: "Markets" },
  { term: "Bond", definition: "A debt instrument in which an issuer borrows money from investors and typically pays interest before repaying principal.", category: "Markets" },
  { term: "Bollinger Bands", definition: "A technical-analysis indicator built around a moving average with upper and lower bands based on volatility.", category: "Trading", aliases: ["BB", "Bollinger"] },
  { term: "Bull Market", definition: "A sustained period of rising prices and generally positive market sentiment.", category: "Markets" },
  { term: "Bullish", definition: "Expecting prices or market conditions to strengthen or rise.", category: "Trading" },
  { term: "Buyback", definition: "When a company repurchases its own shares from the market, reducing the number of shares outstanding.", category: "Markets", aliases: ["share buyback"] },
  { term: "CAGR", definition: "Compound Annual Growth Rate: the constant annualized growth rate that would turn an initial value into a final value over a period.", category: "Markets", aliases: ["Compound Annual Growth Rate"] },
  { term: "Candlestick", definition: "A price chart element showing an asset's open, high, low and close for a chosen period.", category: "Trading" },
  { term: "Capital Gains", definition: "Profit realized when an asset is sold for more than its purchase cost.", category: "Markets" },
  { term: "Capitalization", definition: "The total market value represented by an asset or company; for a company, market cap is share price multiplied by shares outstanding.", category: "Markets", aliases: ["market capitalization", "market cap"] },
  { term: "CEX", definition: "Centralized Exchange: a crypto trading platform operated by a company or centralized entity.", category: "Crypto", aliases: ["centralized exchange"] },
  { term: "Circulating Supply", definition: "The amount of a cryptocurrency currently considered to be circulating and available in the market.", category: "Crypto" },
  { term: "CPI", definition: "Consumer Price Index: a measure of the average change over time in prices paid by consumers for a basket of goods and services.", category: "Macro", aliases: ["Consumer Price Index"] },
  { term: "Core CPI", definition: "CPI excluding food and energy components, commonly used to assess underlying consumer-price trends because those categories can be volatile.", category: "Macro", aliases: ["core consumer price index"] },
  { term: "CVD", definition: "Cumulative Volume Delta: an indicator that tracks the cumulative difference between aggressive buying and selling volume.", category: "Trading", aliases: ["Cumulative Volume Delta"] },
  { term: "DAO", definition: "Decentralized Autonomous Organization: a blockchain-based organization whose rules and governance are typically encoded in smart contracts.", category: "DeFi", aliases: ["Decentralized Autonomous Organization"] },
  { term: "DApp", definition: "Decentralized Application: an application that uses blockchain networks or smart contracts for some of its functionality.", category: "Technology", aliases: ["dapp", "decentralized application"] },
  { term: "Dead Cat Bounce", definition: "A temporary rebound in an asset that remains within a broader declining trend.", category: "Trading" },
  { term: "DeFi", definition: "Decentralized Finance: financial services built primarily with blockchain networks and smart contracts rather than traditional intermediaries.", category: "DeFi", aliases: ["decentralized finance"] },
  { term: "DEX", definition: "Decentralized Exchange: a blockchain-based marketplace that generally enables peer-to-peer token trading through smart contracts.", category: "DeFi", aliases: ["decentralized exchange"] },
  { term: "Dilution", definition: "A reduction in existing shareholders' percentage ownership when a company issues additional shares.", category: "Markets" },
  { term: "Dividend", definition: "A payment a company distributes to shareholders, usually from profits or retained cash.", category: "Markets" },
  { term: "Dollar Index (DXY)", definition: "An index measuring the U.S. dollar against a basket of major foreign currencies; a stronger dollar can influence global risk assets.", category: "Macro", aliases: ["DXY", "US Dollar Index"] },
  { term: "Dominance", definition: "The percentage share of a market represented by a particular asset, such as Bitcoin's share of total crypto market capitalization.", category: "Crypto" },
  { term: "Drawdown", definition: "The decline from a portfolio or asset's previous peak value to a subsequent low before a recovery.", category: "Markets" },
  { term: "ECB", definition: "European Central Bank: the central bank responsible for monetary policy in the euro area.", category: "Macro", aliases: ["European Central Bank"] },
  { term: "Economic Soft Landing", definition: "A situation where economic growth slows enough to reduce inflation without causing a severe recession.", category: "Macro", aliases: ["soft landing"] },
  { term: "EMA", definition: "Exponential Moving Average: a moving average that gives greater weight to more recent prices.", category: "Trading", aliases: ["Exponential Moving Average"] },
  { term: "EPS", definition: "Earnings Per Share: a company's profit attributable to common shareholders divided by the number of common shares outstanding.", category: "Markets", aliases: ["Earnings Per Share"] },
  { term: "ETF", definition: "Exchange-Traded Fund: an investment fund whose shares trade on an exchange like a stock.", category: "Markets", aliases: ["Exchange Traded Fund"] },
  { term: "Ethereum", definition: "A programmable blockchain network whose native asset is Ether and which supports smart contracts and decentralized applications.", category: "Crypto", aliases: ["ETH"] },
  { term: "Ether", definition: "The native cryptocurrency of the Ethereum network, used to pay transaction fees and support network operations.", category: "Crypto", aliases: ["ETH"] },
  { term: "FDV", definition: "Fully Diluted Valuation: the implied market value of a token if the entire planned or maximum supply were circulating at the current price.", category: "Crypto", aliases: ["Fully Diluted Valuation"] },
  { term: "Fed", definition: "The Federal Reserve System, the central banking system of the United States.", category: "Macro", aliases: ["Federal Reserve", "Federal Reserve System"] },
  { term: "Fed Funds Rate", definition: "The target interest-rate range set by the Federal Reserve for overnight lending between U.S. banks.", category: "Macro", aliases: ["federal funds rate", "Fed rate"] },
  { term: "Fibonacci Retracement", definition: "A technical-analysis method using common Fibonacci ratios to identify possible support and resistance areas.", category: "Trading", aliases: ["Fib retracement", "Fibonacci"] },
  { term: "FOMC", definition: "Federal Open Market Committee: the Federal Reserve committee that sets U.S. monetary policy, including the federal funds rate target.", category: "Macro", aliases: ["Federal Open Market Committee"] },
  { term: "Forex", definition: "The foreign-exchange market, where currencies are traded against one another.", category: "Markets", aliases: ["FX", "foreign exchange"] },
  { term: "Funding Rate", definition: "A periodic payment between long and short traders in perpetual futures markets that helps keep the contract price near its reference price.", category: "Crypto" },
  { term: "Gas", definition: "The fee paid to execute transactions or smart-contract operations on a blockchain network.", category: "Crypto", aliases: ["gas fee"] },
  { term: "GDP", definition: "Gross Domestic Product: the monetary value of final goods and services produced within an economy over a period.", category: "Macro", aliases: ["Gross Domestic Product"] },
  { term: "Golden Cross", definition: "A technical pattern in which a shorter-term moving average crosses above a longer-term moving average, often interpreted as a bullish signal.", category: "Trading" },
  { term: "Hash Rate", definition: "The amount of computing power used to perform hashing operations on a proof-of-work blockchain.", category: "Crypto", aliases: ["hashrate"] },
  { term: "HODL", definition: "Crypto slang for holding an asset rather than selling it in response to short-term price movements.", category: "Crypto" },
  { term: "Honeypot", definition: "A malicious token or smart contract designed to attract buyers while preventing or severely restricting selling.", category: "Crypto" },
  { term: "Inflation", definition: "A sustained increase in the general price level of goods and services, reducing the purchasing power of money.", category: "Macro" },
  { term: "Interest Rate", definition: "The cost of borrowing money or the return earned for lending or saving money, usually expressed as a percentage.", category: "Macro" },
  { term: "Liquidity", definition: "The ease with which an asset can be bought or sold without causing a large change in its price.", category: "Markets" },
  { term: "Liquidity Pool", definition: "A pool of tokens supplied to a decentralized exchange or DeFi protocol to facilitate trading and other activities.", category: "DeFi" },
  { term: "Long", definition: "A position that benefits if the price of an asset rises.", category: "Trading" },
  { term: "MACD", definition: "Moving Average Convergence Divergence: a momentum indicator based on differences between exponential moving averages and a signal line.", category: "Trading", aliases: ["Moving Average Convergence Divergence"] },
  { term: "Market Cap", definition: "The market value of a company or crypto asset. For stocks it is generally share price times shares outstanding; for crypto it is commonly price times circulating supply.", category: "Markets", aliases: ["market capitalization"] },
  { term: "Market Order", definition: "An order to buy or sell immediately at the best available market price.", category: "Trading" },
  { term: "Meme Coin", definition: "A cryptocurrency strongly associated with internet culture, memes or community-driven speculation.", category: "Crypto", aliases: ["memecoin"] },
  { term: "Mempool", definition: "A waiting area where valid but not-yet-confirmed blockchain transactions may remain before inclusion in a block.", category: "Crypto" },
  { term: "Mining", definition: "The process used by proof-of-work blockchains in which participants use computing power to help secure the network and add blocks.", category: "Crypto" },
  { term: "Momentum", definition: "The tendency of an asset's price movement to persist in the same direction for a period.", category: "Trading" },
  { term: "Moving Average", definition: "A rolling average of prices used to smooth market data and identify trends.", category: "Trading", aliases: ["MA"] },
  { term: "NFP", definition: "Nonfarm Payrolls: a key U.S. employment measure reporting changes in payroll employment outside the farming sector and certain other categories.", category: "Macro", aliases: ["Nonfarm Payrolls", "Non-Farm Payrolls"] },
  { term: "NFT", definition: "Non-Fungible Token: a unique blockchain-based token representing ownership or association with a specific digital or physical item.", category: "Crypto", aliases: ["Non-Fungible Token"] },
  { term: "OI", definition: "Open Interest: the total number or value of outstanding derivative contracts that remain open.", category: "Trading", aliases: ["Open Interest"] },
  { term: "OBI", definition: "Order Book Imbalance: a measure comparing buying and selling liquidity visible in an order book.", category: "Trading", aliases: ["Order Book Imbalance"] },
  { term: "Order Book", definition: "A live list of buy and sell orders for an asset at different prices.", category: "Trading" },
  { term: "PCE", definition: "Personal Consumption Expenditures price index: a U.S. inflation measure closely followed by the Federal Reserve.", category: "Macro", aliases: ["PCE Price Index", "Personal Consumption Expenditures"] },
  { term: "Perpetual Futures", definition: "A derivative contract similar to a futures contract but without a fixed expiry date; funding payments help anchor it to the underlying market.", category: "Crypto", aliases: ["perps", "perpetuals"] },
  { term: "PPI", definition: "Producer Price Index: a measure of the average change over time in selling prices received by domestic producers.", category: "Macro", aliases: ["Producer Price Index"] },
  { term: "Proof of Stake", definition: "A blockchain consensus method in which validators typically lock or stake assets to participate in securing the network.", category: "Crypto", aliases: ["PoS"] },
  { term: "Proof of Work", definition: "A blockchain consensus method in which miners use computational work to help secure the network and produce blocks.", category: "Crypto", aliases: ["PoW"] },
  { term: "Protocol", definition: "The set of rules and software that governs how a blockchain or decentralized application operates.", category: "Technology" },
  { term: "Quantitative Easing", definition: "A central-bank policy involving large-scale purchases of financial assets intended to influence financial conditions and support the economy.", category: "Macro", aliases: ["QE"] },
  { term: "Quantitative Tightening", definition: "A central-bank policy that reduces the size of a balance sheet, often by allowing assets to mature without replacement or by selling assets.", category: "Macro", aliases: ["QT"] },
  { term: "Rally", definition: "A sustained or notable rise in the price of an asset or market.", category: "Markets" },
  { term: "Resistance", definition: "A price area where selling pressure has historically tended to limit further upward movement.", category: "Trading" },
  { term: "RSI", definition: "Relative Strength Index: a momentum oscillator commonly scaled from 0 to 100 and used to assess recent price momentum.", category: "Trading", aliases: ["Relative Strength Index"] },
  { term: "Risk-On", definition: "A market environment in which investors generally favor assets perceived as carrying more risk in pursuit of higher returns.", category: "Markets", aliases: ["risk on"] },
  { term: "Risk-Off", definition: "A market environment in which investors generally favor assets perceived as safer and reduce exposure to riskier assets.", category: "Markets", aliases: ["risk off"] },
  { term: "ROI", definition: "Return on Investment: the gain or loss relative to the amount invested.", category: "Markets", aliases: ["Return on Investment"] },
  { term: "SEC", definition: "U.S. Securities and Exchange Commission: the federal agency responsible for enforcing U.S. securities laws and regulating securities markets.", category: "Macro", aliases: ["Securities and Exchange Commission"] },
  { term: "Self-Custody", definition: "Holding and controlling crypto assets through your own wallet keys rather than relying on a third-party custodian.", category: "Crypto" },
  { term: "Short", definition: "A position that generally benefits if the price of an asset falls.", category: "Trading" },
  { term: "Slippage", definition: "The difference between an expected execution price and the actual price received, often caused by market movement or limited liquidity.", category: "Trading" },
  { term: "Smart Contract", definition: "Blockchain software that automatically executes programmed rules when specified conditions are met.", category: "Technology" },
  { term: "Solana", definition: "A high-throughput blockchain network whose native asset is SOL and which supports smart contracts and decentralized applications.", category: "Crypto", aliases: ["SOL"] },
  { term: "Stablecoin", definition: "A crypto asset designed to maintain a relatively stable value, often by referencing a fiat currency such as the U.S. dollar.", category: "Crypto" },
  { term: "Staking", definition: "Locking or committing crypto assets to support a proof-of-stake network or protocol, typically in exchange for rewards.", category: "Crypto" },
  { term: "Stock", definition: "A financial security representing an ownership interest in a company.", category: "Markets", aliases: ["equity", "share"] },
  { term: "Support", definition: "A price area where buying pressure has historically tended to slow or stop a decline.", category: "Trading" },
  { term: "Supply", definition: "The quantity of an asset available or expected to become available in a market; crypto projects often distinguish circulating, total and maximum supply.", category: "Markets" },
  { term: "Token", definition: "A blockchain-based digital asset that can represent value, utility, governance rights or other forms of ownership or access.", category: "Crypto" },
  { term: "Tokenomics", definition: "The economic design of a crypto token, including supply, distribution, utility, incentives, emissions and unlocks.", category: "Crypto", aliases: ["token economics"] },
  { term: "Total Supply", definition: "The amount of a crypto asset that currently exists, generally excluding coins or tokens that have been permanently destroyed.", category: "Crypto" },
  { term: "Total Value Locked (TVL)", definition: "The value of assets deposited in a DeFi protocol or ecosystem, commonly used as a measure of activity and scale.", category: "DeFi", aliases: ["TVL"] },
  { term: "Treasury Yield", definition: "The interest rate or yield associated with U.S. Treasury securities of a particular maturity.", category: "Macro", aliases: ["Treasury yield"] },
  { term: "Unemployment Rate", definition: "The percentage of the labor force that is unemployed and actively seeking work.", category: "Macro" },
  { term: "Unlock", definition: "The release of previously restricted crypto tokens into circulation according to a project's vesting or distribution schedule.", category: "Crypto", aliases: ["token unlock"] },
  { term: "Volatility", definition: "A measure of how much and how quickly an asset's price tends to fluctuate.", category: "Markets" },
  { term: "Volume", definition: "The amount of an asset traded during a specified period.", category: "Trading" },
  { term: "VWAP", definition: "Volume-Weighted Average Price: the average traded price weighted by volume over a chosen period.", category: "Trading", aliases: ["Volume Weighted Average Price"] },
  { term: "Wallet", definition: "Software or hardware used to manage blockchain addresses and the cryptographic keys needed to authorize transactions.", category: "Crypto" },
  { term: "Whale", definition: "A person, entity or wallet holding a sufficiently large amount of an asset that its transactions may attract market attention.", category: "Crypto" },
  { term: "Yield", definition: "The income or return generated by an investment, commonly expressed as a percentage of its value or cost.", category: "Markets" },
  { term: "Yield Curve", definition: "A graph showing interest rates or yields across different maturities of debt securities, especially U.S. Treasuries.", category: "Macro" },
  { term: "Zero-Knowledge Proof", definition: "A cryptographic method that lets one party prove a statement is true without revealing the underlying information needed to establish it.", category: "Technology", aliases: ["ZK proof", "ZKP"] },
];

export const GLOSSARY_LETTERS = Array.from(new Set(GLOSSARY.map((entry) => entry.term[0].toUpperCase()))).sort();

export function searchGlossary(query: string): GlossaryEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return GLOSSARY;

  return [...GLOSSARY]
    .map((entry) => {
      const term = entry.term.toLowerCase();
      const aliases = (entry.aliases ?? []).join(" ").toLowerCase();
      const definition = entry.definition.toLowerCase();
      let score = 0;
      if (term === normalized) score += 100;
      if (aliases.split(" ").includes(normalized)) score += 90;
      if (term.startsWith(normalized)) score += 70;
      if (aliases.includes(normalized)) score += 50;
      if (definition.includes(normalized)) score += 20;
      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.term.localeCompare(b.entry.term))
    .map(({ entry }) => entry);
}
