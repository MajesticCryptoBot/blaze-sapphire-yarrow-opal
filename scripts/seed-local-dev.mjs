#!/usr/bin/env node
/**
 * Seed local dev PGlite with realistic test posts via the real ingest endpoint.
 * Usage: node scripts/seed-local-dev.mjs [count]
 * Requires the dev server running with WEBSITE_INGEST_SECRET set (see below).
 */
const BASE = process.env.SEED_BASE ?? "http://localhost:8080";
const SECRET = process.env.SEED_SECRET ?? "local-dev-seed";
const COUNT = Number(process.argv[2] ?? 22);

// 3x2 landscape 480x270 JPEG-ish placeholder via tiny SVG-in-PNG? Simplest:
// use a real small JPEG generated with node zlib-free minimal canvas — instead
// we embed a compact solid-color JPEG (base64) and vary size/color per seed.
// A 1x1 red pixel JPEG is tiny; Telegram photos in tests just need bytes.
const JPEG_1PX =
  "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a" +
  "HBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIy" +
  "MjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIA" +
  "AhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQA" +
  "AAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3" +
  "ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWm" +
  "p6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEA" +
  "AwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSEx" +
  "BhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElK" +
  "U1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3" +
  "uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iii" +
  "gD//2Q==";

const HEADLINES = [
  ["BREAKING: Bitcoin reclaims the $100K line as spot ETF flows hit a fresh record", "BlackRock's IBIT alone absorbed nine figures in net creations overnight, and perp funding stays mildly positive across majors. Order books thinned into the New York open, and the reclaim triggered a wave of short liquidations within minutes."],
  ["JUST IN: Ethereum validators approve the timeline for the next protocol upgrade", "Core developers confirmed the testnet schedule, with mainnet epoch alignment penciled for next quarter. Staking entrance queues lengthened slightly as deposits picked up ahead of the announcement."],
  ["ALERT: Fed minutes signal patience on rate cuts as inflation cools unevenly", "Policymakers flagged services inflation as sticky while acknowledging labor-market softening. Rate futures trimmed odds of a cut at the next meeting to below 40 percent."],
  ["Nvidia caps the week with data-center revenue up triple digits year over year", "Management guided supply constraints easing through the year, and hyperscaler capex commentary stayed firm. The after-hours tape gapped higher before settling near the highs."],
  ["Sovereign wealth funds quietly grow crypto allocations, filings show", "Two Gulf-state funds disclosed indirect exposure through regulated vehicles in quarterly filings. Analysts read it as continued normalization rather than a directional bet."],
  ["Solana DEX volumes overtake Ethereum for the third straight week", "Meme-driven turnover cooled, but stablecoin pairs held the line. Validators see fee revenue concentrated in a handful of apps, renewing MEV debates."],
  ["Apple unveils on-device AI summarization for iOS messages and mail", "The company says translation and summaries run fully offline on new silicon. Privacy advocates note the architecture avoids server round-trips entirely."],
  ["Oil slips as OPEC+ compliance improves and inventories build modestly", "Traders look past the weekly swing factor and focus on the spring demand transition. Brent holds a narrow range as positioning stays light."],
  ["Stablecoin settlement volumes print an all-time high for a single month", "USDC and USDT combined cleared more value than major card networks, per public chain data. Most flow concentrates on Ethereum layer-2 rollups."],
  ["Gold steady near record as central banks keep buying the dip", "Official-sector purchases ran at an annualized record pace for a fourth quarter. ETF outflows stopped for the first time in nine months."],
  ["MicroStrategy adds to its bitcoin pile with a new convertible offering", "The company priced notes at a premium conversion, extending the buy-and-hold playbook. Shares see-sawed as arbitrage desks crowded the trade."],
  ["OpenAI ships a faster reasoning model with lower API pricing", "Benchmarks show material gains on math and code tasks at half the latency. Enterprise contracts in the pipeline reportedly doubled this quarter."],
  ["Euro-area PMIs cross into expansion for the first time in over a year", "Services led the turn while manufacturing stabilizes near flat. Bund yields rose a few basis points on the print."],
  ["Coinbase revenue beats on subscription and services growth", "Trading share held steady despite fee wars, and custody assets hit a new high. Management flagged international expansion as the 2026 driver."],
  ["Japan's yen intervention chatter returns as USDJPY tests the band", "Officials repeated they are ready to act excessively against fast moves. Options skew shows demand for yen calls into month-end."],
  ["Ripple wins procedural round as court sets the remedies schedule", "Both sides filed narrowed briefing plans, and the industry read the tone as constructive. XRP spot volumes spiked on the headline before fading."],
  ["Tesla energy storage deployments double, cushioning auto margin pressure", "Megapack backlog extends into next year on new factory capacity. Analysts now model storage as a third of gross profit by 2027."],
  ["Amazon folds AI shopping assistant into the main app worldwide", "The rollout replaces the separate app and adds voice input in five languages. Retail rivals watched conversion data before answering."],
  ["China quietly expands its digital yuan pilot to cross-border settlement", "State banks connected corridor tests with two Gulf partners, per minutes.Volumes remain small but the plumbing is the signal, analysts say."],
  ["Kraken lists tokenized Treasuries for non-US clients", "The product settles on-chain and pays yield daily, targeting offshore desks. Compliance filings note strict geo-fencing at the API level."],
  ["Ukraine reconstruction fund drafts rules to accept crypto donations at scale", "Draft guidance covers custody, audit, and conversion to fiat within days. Officials describe it as rails-first, amounts later."],
  ["Uniswap governance passes fee-switch activation for major pools", "Treasury accrual starts with a small protocol cut on three pairs. Delegates framed it as a sustainability test, not a revenue grab."],
];

async function post(secret, body) {
  const res = await fetch(`${BASE}/api/news-ingest`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-website-ingest-secret": secret },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 200)}`);
  return JSON.parse(text);
}

const now = Date.now();
let seeded = 0;
for (let i = 0; i < COUNT; i++) {
  const [headline, dek] = HEADLINES[i % HEADLINES.length];
  const id = 900_000 + i;
  const publishedAt = new Date(now - i * 3.7 * 3600_000).toISOString();
  const mode = i % 4; // 0,1: single photo · 2: photo pair · 3: text only
  const body = {
    channel: "alphasignalspro",
    chatUsername: "AlphaSignalsPro",
    chatTitle: "Alpha Signals Pro",
    messageId: id,
    text: `${headline}\n\n${dek}`,
    publishedAt,
    messageUrl: `https://t.me/AlphaSignalsPro/${id}`,
  };
  if (mode === 0 || mode === 1) Object.assign(body, { photoBase64: JPEG_1PX, photoMimeType: "image/jpeg" });
  if (mode === 2) {
    Object.assign(body, { photoBase64: JPEG_1PX, photoMimeType: "image/jpeg" });
    body.__second = true;
  }
  await post(SECRET, body);
  if (mode === 2) {
    // second photo of the pair — the v1 endpoint updates the same message row
    try {
      await post(SECRET, { ...body, messageId: id, text: `${headline}\n\n${dek}`, photoBase64: JPEG_1PX });
    } catch {}
  }
  seeded++;
}
console.log(`seeded ${seeded} posts`);
