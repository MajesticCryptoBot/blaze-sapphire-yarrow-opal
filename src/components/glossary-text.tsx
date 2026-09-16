import { useMemo, type ReactNode } from "react";
import { GLOSSARY } from "@/lib/glossary";

/** High-signal terms to underline on first mention in story body. */
const PRIORITY = [
  "FOMC",
  "CPI",
  "PCE",
  "Nonfarm",
  "NFP",
  "ETF",
  "Bitcoin",
  "BTC",
  "Ethereum",
  "ETH",
  "Solana",
  "XRP",
  "DeFi",
  "stablecoin",
  "halving",
  "SEC",
  "CFTC",
  "basis point",
  "bps",
  "yield",
  "Federal Reserve",
  "the Fed",
  "spot Bitcoin ETF",
  "liquidation",
  "open interest",
  "funding rate",
  "Layer 2",
  "L2",
  "staking",
  "market cap",
  "volatility",
  "liquidity",
];

type Match = { term: string; definition: string; pattern: RegExp };

function buildMatchers(): Match[] {
  const byKey = new Map<string, Match>();
  for (const entry of GLOSSARY) {
    const candidates = [entry.term, ...(entry.aliases ?? [])];
    for (const candidate of candidates) {
      if (candidate.length < 3) continue;
      const key = candidate.toLowerCase();
      if (byKey.has(key)) continue;
      const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      byKey.set(key, {
        term: entry.term,
        definition: entry.definition,
        pattern: new RegExp(`\\b${escaped}\\b`, "i"),
      });
    }
  }
  // Prefer priority list order for first-hit quality
  const ordered: Match[] = [];
  for (const p of PRIORITY) {
    const hit = byKey.get(p.toLowerCase());
    if (hit) ordered.push(hit);
  }
  for (const m of byKey.values()) {
    if (!ordered.includes(m)) ordered.push(m);
  }
  return ordered.slice(0, 120);
}

const MATCHERS = buildMatchers();

export function GlossaryText({ text }: { text: string }) {
  const nodes = useMemo(() => annotate(text), [text]);
  return <>{nodes}</>;
}

function annotate(text: string): ReactNode[] {
  const used = new Set<string>();
  const out: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let best: { index: number; length: number; match: Match } | null = null;
    for (const match of MATCHERS) {
      if (used.has(match.term.toLowerCase())) continue;
      match.pattern.lastIndex = 0;
      const found = remaining.match(match.pattern);
      if (!found || found.index === undefined) continue;
      if (!best || found.index < best.index) {
        best = { index: found.index, length: found[0].length, match };
      }
    }

    if (!best) {
      out.push(remaining);
      break;
    }

    if (best.index > 0) {
      out.push(remaining.slice(0, best.index));
    }
    const word = remaining.slice(best.index, best.index + best.length);
    used.add(best.match.term.toLowerCase());
    out.push(
      <span
        key={`g-${key++}`}
        className="glossary-term cursor-help border-b border-dotted border-azure/50 text-foreground"
        title={best.match.definition}
      >
        {word}
      </span>,
    );
    remaining = remaining.slice(best.index + best.length);
  }

  return out;
}
