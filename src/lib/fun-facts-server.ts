import { CRYPTO_FACTS, type CryptoFact } from "@/lib/crypto-facts";

/**
 * Fresh Fun Facts feed — editions drawn EXCLUSIVELY from the desk's crypto
 * notebook (src/lib/crypto-facts.ts).
 *
 * House policy: no Wikipedia "On this day" feed, no generic history. An
 * earlier version mixed in a general "on this day" stream with a keyword
 * filter, which kept letting non-crypto material (politics, wars, general
 * tech) onto the page. The feed is gone; every fact now comes from the
 * curated crypto-only notebook.
 *
 * Edition mechanics:
 *   - Every CADENCE_MS (60 hours ≈ 2.5 days) a new edition is generated.
 *   - A deterministic seeded shuffle fixes the notebook's order, then a
 *     sliding window moves through it — 8 cards per edition, offset by 8
 *     each time. Consecutive editions share no facts, and with ~100 entries
 *     the cycle restarts only after roughly a month.
 *   - Each edition guarantees at least one "humor" card for lightness.
 *   - Everything is deterministic: no network fetches, so the endpoint can
 *     never fail, hang, or drift off-topic.
 */

const EDITION_SIZE = 8;

// 2.5-day cadence requested by the desk: new edition every two-three days.
const CADENCE_MS = 60 * 60 * 1000 * 60; // 60 hours

type CachedEdition = {
  bucket: number;
  payload: FunFactsPayload;
};

type FunFactsPayload = {
  facts: CryptoFact[];
  freshCount: number;
  source: "notebook";
  updatedAt: string;
  nextUpdateAt: string;
};

/** Deterministic PRNG (mulberry32) so the shuffle is stable across restarts. */
function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const arr = [...items];
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function bucketNow(): number {
  return Math.floor(Date.now() / CADENCE_MS);
}

function cadenceBounds(bucket: number) {
  const start = bucket * CADENCE_MS;
  return { start, end: start + CADENCE_MS };
}

// Fixed seed → the same shuffled order on every server instance, so every
// visitor worldwide sees the same edition for the same 60-hour window.
const NOTEBOOK = seededShuffle(CRYPTO_FACTS, 0x41535031); // "ASP1"

function editionFor(bucket: number): FunFactsPayload {
  const pool = NOTEBOOK;
  const start =
    (((bucket * EDITION_SIZE) % pool.length) + pool.length) % pool.length;

  const window: CryptoFact[] = [];
  for (let i = 0; i < EDITION_SIZE && i < pool.length; i++) {
    window.push(pool[(start + i) % pool.length]);
  }

  // Guarantee at least one humor card per edition.
  if (!window.some((fact) => fact.tone === "humor")) {
    const humor = pool.find((fact) => fact.tone === "humor" && !window.includes(fact));
    if (humor) window[window.length - 1] = humor;
  }

  const { end } = cadenceBounds(bucket);
  return {
    facts: window,
    // Every card in the window is new to this edition — mark them all fresh.
    freshCount: window.length,
    source: "notebook",
    updatedAt: new Date().toISOString(),
    nextUpdateAt: new Date(end).toISOString(),
  };
}

const globalRef = globalThis as typeof globalThis & {
  __aspFunFactsEdition__?: CachedEdition;
};

export async function funFactsPayload(): Promise<FunFactsPayload> {
  const bucket = bucketNow();
  const cached = globalRef.__aspFunFactsEdition__;

  // Deterministic content: reuse the cached edition within the same bucket.
  if (cached && cached.bucket === bucket) return cached.payload;

  const edition: CachedEdition = { bucket, payload: editionFor(bucket) };
  globalRef.__aspFunFactsEdition__ = edition;
  return edition.payload;
}
