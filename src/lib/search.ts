/** Normalize text for search: lowercase, strip urls/noise, collapse spaces */
export function normalizeSearchText(input: string) {
  return input
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[@#]/g, " ")
    .replace(/[^\p{L}\p{N}.$%+-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Split query into meaningful tokens (drop ultra-short noise except tickers) */
export function tokenizeQuery(query: string): string[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];

  const raw = normalized.split(" ").filter(Boolean);
  const tokens: string[] = [];

  for (const token of raw) {
    // Keep short tickers / symbols (btc, eth, ai, us, eu, sec…)
    if (token.length <= 2) {
      if (/^[a-z0-9.$%-]+$/i.test(token)) tokens.push(token);
      continue;
    }
    tokens.push(token);
  }

  // Dedupe while preserving order
  return [...new Set(tokens)];
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Word-boundary-ish match that still works for tickers like BTC / S&P */
function tokenMatches(haystack: string, token: string) {
  if (!token) return false;
  if (token.length <= 3) {
    const re = new RegExp(`(?:^|[^\\p{L}\\p{N}])${escapeRegExp(token)}(?:$|[^\\p{L}\\p{N}])`, "iu");
    return re.test(haystack);
  }
  return haystack.includes(token);
}

export type SearchableArticle = {
  headline: string;
  dek: string;
  body: string[];
  category: string;
  tag: string;
  tickers: string[];
};

/**
 * Score how well an article matches the query.
 * Returns 0 if it should be excluded.
 * Headline hits weigh more so the right brief surfaces first.
 */
export function scoreArticleMatch(article: SearchableArticle, query: string): number {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return 1;

  const headline = normalizeSearchText(article.headline);
  const dek = normalizeSearchText(article.dek);
  const body = normalizeSearchText(article.body.join(" "));
  const meta = normalizeSearchText([article.category, article.tag, article.tickers.join(" ")].join(" "));
  const full = `${headline} ${dek} ${body} ${meta}`;

  let score = 0;

  for (const token of tokens) {
    let hit = false;
    if (tokenMatches(headline, token)) {
      score += 6;
      hit = true;
    } else if (tokenMatches(dek, token)) {
      score += 3;
      hit = true;
    } else if (tokenMatches(meta, token)) {
      score += 2;
      hit = true;
    } else if (tokenMatches(body, token) || tokenMatches(full, token)) {
      score += 1;
      hit = true;
    }
    // Multi-word queries: every token must appear somewhere
    if (!hit) return 0;
  }

  // Bonus for full phrase in headline
  const phrase = normalizeSearchText(query);
  if (phrase.length > 3 && headline.includes(phrase)) score += 8;
  else if (phrase.length > 3 && full.includes(phrase)) score += 2;

  return score;
}

export function filterAndRankArticles<T extends SearchableArticle>(articles: T[], query: string): T[] {
  const q = query.trim();
  if (!q) return articles;

  const scored = articles
    .map((article) => ({ article, score: scoreArticleMatch(article, q) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((row) => row.article);
}
