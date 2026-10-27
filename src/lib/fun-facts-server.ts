import { CRYPTO_FACTS, type CryptoFact } from "@/lib/crypto-facts";

/**
 * Fresh Fun Facts feed.
 *
 * The static notebook in src/lib/crypto-facts.ts was frozen at site launch —
 * readers kept seeing the same eight cards. This endpoint serves a rotating
 * edition instead:
 *
 *   - Every EDITION_TTL_MS (2.5 days) a new edition is generated.
 *   - Fresh entries come from Wikipedia's "On this day" feed (free, no key),
 *     filtered down to money / markets / technology history that fits ASP's
 *     beat, so the page keeps gaining new material over time.
 *   - The classic notebook fills whatever the day's feed cannot cover, also
 *     rotated per edition, so the page is never thinner than eight cards.
 *   - If Wikipedia is unreachable, the endpoint still answers with a rotated
 *     notebook edition (the site never breaks) and retries the feed later.
 */

const EDITION_SIZE = 8;
const FRESH_TARGET = 6;
const WIKI_TIMEOUT_MS = 5_000;

// 2.5-day cadence requested by the desk: new edition every two-three days.
const CADENCE_MS = 60 * 60 * 1000 * 60; // 60 hours

type CachedEdition = {
  bucket: number;
  payload: FunFactsPayload;
  stale: boolean;
};

type FunFactsPayload = {
  facts: CryptoFact[];
  freshCount: number;
  source: "wikipedia+notebook" | "notebook";
  updatedAt: string;
  nextUpdateAt: string;
};

type WikiEvent = {
  text?: string;
  year?: number;
  pages?: Array<{
    titles?: { normalized?: string; canonical?: string };
    content_urls?: { desktop?: { page?: string } };
  }>;
};

const RELEVANCE =
  /(bitcoin|btc|ethereum|ether|crypto|blockchain|stablecoin|token|coin|nft|currency|currencies|money|monetary|bank|banking|central bank|federal reserve|ecb|imf|world bank|inflation|recession|depression|economy|economic|gdp|stock|stocks|exchange|wall street|nasdaq|dow jones|s&p|bond|treasury|market|markets|trader|trading|tariff|trade|dollar|euro|yen|yuan|pound|gold|silver|oil|opec|commodity|energy|tech|technology|computer|internet|software|hardware|artificial intelligence|\bai\b|machine learning|smartphone|phone|chip|semiconductor|silicon|satellite|space|nasa|rocket|orbit|launch|founded|ipo|merger|acquisition|startup|company|corporation|conglomerate|platform|google|apple|microsoft|amazon|tesla|meta|facebook|netflix|ibm|intel|nokia|sony|samsung|telegraph|radio|television|electricity|engine|factory|industrial|railroad|railway|automobile|airplane|aviation|nuclear|telegram|wire)/i;

function bucketNow(): number {
  return Math.floor(Date.now() / CADENCE_MS);
}

function cadenceBounds(bucket: number) {
  const start = bucket * CADENCE_MS;
  return { start, end: start + CADENCE_MS };
}

/** Deterministic rotation of the static notebook for an edition bucket. */
function notebookEdition(bucket: number, count: number): CryptoFact[] {
  if (CRYPTO_FACTS.length === 0) return [];
  const offset = ((bucket % CRYPTO_FACTS.length) + CRYPTO_FACTS.length) % CRYPTO_FACTS.length;
  const rotated = [...CRYPTO_FACTS.slice(offset), ...CRYPTO_FACTS.slice(0, offset)];
  const classic = rotated.filter((f) => f.tone !== "humor");
  const humor = rotated.filter((f) => f.tone === "humor");
  const humorTake = Math.min(humor.length, Math.max(1, Math.round(count * 0.25)));
  const picked = [...humor.slice(0, humorTake), ...classic];
  return picked.slice(0, count);
}

function titleFromEvent(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  const firstSentence = clean.split(/(?<=[.!?])\s/)[0] ?? clean;
  if (firstSentence.length <= 90) return firstSentence;
  const clipped = clean.slice(0, 88);
  const cut = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, cut > 40 ? cut : 88)}…`;
}

function factFromEvent(event: WikiEvent): CryptoFact | null {
  const text = String(event.text ?? "").replace(/\s+/g, " ").trim();
  if (text.length < 60 || !RELEVANCE.test(text)) return null;
  const page = event.pages?.find((p) => p?.content_urls?.desktop?.page) ?? event.pages?.[0];
  const href = page?.content_urls?.desktop?.page;
  const label = page?.titles?.normalized ?? page?.titles?.canonical;
  return {
    title: titleFromEvent(text),
    body: text,
    year: String(event.year ?? ""),
    source: label ? `Wikipedia — ${label}` : "Wikipedia — On this day",
    href: href || "https://en.wikipedia.org/wiki/Main_Page",
    tone: "classic",
  };
}

async function fetchWikiFacts(): Promise<CryptoFact[]> {
  const now = new Date();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  // Yesterday's feed too, so editions never come up empty on slow news-history days.
  const yesterday = new Date(now.getTime() - 24 * 3600 * 1000);
  const mmY = String(yesterday.getUTCMonth() + 1).padStart(2, "0");
  const ddY = String(yesterday.getUTCDate()).padStart(2, "0");
  // Same Wikimedia feed on two hosts: en.wikipedia.org serves client fetches
  // generously; api.wikimedia.org is kept as a redundant mirror.
  const hosts = [
    (d: { mm: string; dd: string }) =>
      `https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected/${d.mm}/${d.dd}`,
    (d: { mm: string; dd: string }) =>
      `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/selected/${d.mm}/${d.dd}`,
  ];
  const urls = [
    { url: hosts[0]({ mm, dd }), fallback: hosts[1]({ mm, dd }) },
    { url: hosts[0]({ mm: mmY, dd: ddY }), fallback: hosts[1]({ mm: mmY, dd: ddY }) },
  ];

  const events: WikiEvent[] = [];
  await Promise.all(
    urls.map(async ({ url, fallback }) => {
      const attempts = [url, fallback];
      for (const attempt of attempts) {
        try {
          const response = await fetch(attempt, {
            headers: {
              "user-agent":
                "ASP-News-FunFacts/1.0 (news website editorial feature; contact: asp-news@example.com)",
              accept: "application/json",
            },
            signal: AbortSignal.timeout(WIKI_TIMEOUT_MS),
          });
          if (!response.ok) continue;
          const payload = (await response.json()) as { selected?: WikiEvent[] };
          events.push(...(payload.selected ?? []));
          return;
        } catch {
          // Try the mirror, then give up — the notebook fallback covers the edition.
        }
      }
    }),
  );

  const facts = events
    .map(factFromEvent)
    .filter((f): f is CryptoFact => f !== null)
    // Spread across different eras: sort by relevance density then dedupe titles
    .sort((a, b) => b.body.length - a.body.length)
    .filter((fact, index, all) => all.findIndex((f) => f.title === fact.title) === index);

  // Prefer a varied timeline: one fact per era bucket, strongest first.
  const byEra = new Map<string, CryptoFact>();
  for (const fact of facts) {
    const era = fact.year;
    if (!byEra.has(era)) byEra.set(era, fact);
    if (byEra.size >= FRESH_TARGET) break;
  }
  return [...byEra.values()].slice(0, FRESH_TARGET);
}

async function buildEdition(bucket: number): Promise<CachedEdition> {
  const fresh = await fetchWikiFacts();
  const freshCount = fresh.length;
  const filler = notebookEdition(bucket, EDITION_SIZE - freshCount);
  const facts = [...fresh, ...filler].slice(0, EDITION_SIZE);
  const { end } = cadenceBounds(bucket);
  return {
    bucket,
    stale: freshCount === 0,
    payload: {
      facts,
      freshCount,
      source: freshCount > 0 ? "wikipedia+notebook" : "notebook",
      updatedAt: new Date().toISOString(),
      nextUpdateAt: new Date(end).toISOString(),
    },
  };
}

const globalRef = globalThis as typeof globalThis & {
  __aspFunFactsEdition__?: CachedEdition;
};

export async function funFactsPayload(): Promise<FunFactsPayload> {
  const bucket = bucketNow();
  const cached = globalRef.__aspFunFactsEdition__;

  if (cached && cached.bucket === bucket && !cached.stale) return cached.payload;

  // A stale (feed-less) edition is retried at most once every 30 minutes,
  // so a Wikipedia outage never turns into per-request hammering.
  if (cached && cached.bucket === bucket && cached.stale) {
    const age = Date.now() - new Date(cached.payload.updatedAt).getTime();
    if (age < 30 * 60 * 1000) return cached.payload;
  }

  const edition = await buildEdition(bucket);
  globalRef.__aspFunFactsEdition__ = edition;
  return edition.payload;
}
