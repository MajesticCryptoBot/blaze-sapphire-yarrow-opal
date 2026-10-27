import { useEffect, useState } from "react";
import { formatTime } from "@/lib/news";
import { fetchBinanceMarkets, PRICE_REFRESH_MS, type MarketQuote } from "@/lib/binance-markets";
import { splitHeadline, type TelegramPost } from "@/lib/telegram-feed";
import { storyPath } from "@/lib/story-url";

/**
 * Editorial side rails — quiet, useful filler for the wide-screen margins.
 *
 * They only appear on viewports wide enough to have real blank space
 * (≥ 1760px), so they never crowd the reading column. The left rail carries a
 * compact market snapshot; the right rail lists the newest headlines. Both
 * hide themselves on any fetch failure — they decorate, never disturb.
 */

const RAIL_REFRESH_MS = 60_000;
const MAJORS = ["BTC", "ETH", "SOL", "XRP", "BNB"];

function formatPrice(value: number) {
  if (value >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (value >= 1) return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

function useMarkets(enabled: boolean) {
  const [rows, setRows] = useState<MarketQuote[]>([]);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/market-prices", { cache: "no-store" });
        if (response.ok) {
          const payload = (await response.json()) as { data?: MarketQuote[] };
          const data = payload.data ?? [];
          if (active && data.length > 0) {
            setRows(data);
            return;
          }
        }
      } catch {
        // fall through
      }
      try {
        const data = await fetchBinanceMarkets();
        if (active && data.length > 0) setRows(data);
      } catch {
        // leave the rail empty — it hides itself
      }
    };
    void load();
    const timer = window.setInterval(load, PRICE_REFRESH_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [enabled]);

  return rows;
}

function useHeadlines(enabled: boolean) {
  const [posts, setPosts] = useState<TelegramPost[]>([]);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/news", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { posts?: TelegramPost[] };
        if (active) setPosts(payload.posts ?? []);
      } catch {
        // leave the rail empty — it hides itself
      }
    };
    void load();
    const timer = window.setInterval(load, RAIL_REFRESH_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [enabled]);

  return posts;
}

function MarketRail() {
  const rows = useMarkets(true);
  const picked = MAJORS.map((symbol) => rows.find((row) => row.symbol === symbol)).filter(
    (row): row is MarketQuote => Boolean(row),
  );
  const fallback = picked.length > 0 ? picked : rows.filter((r) => r.group === "crypto").slice(0, 5);
  if (fallback.length === 0) return null;

  return (
    <aside className="side-rail side-rail-left" aria-label="Market snapshot">
      <p className="side-rail-label">Markets · live</p>
      <ul className="side-rail-list">
        {fallback.map((row) => {
          const up = row.change24h >= 0;
          return (
            <li key={row.symbol} className="side-rail-row">
              <span className="font-mono text-[11px] font-semibold text-foreground">{row.symbol}</span>
              <span className="ml-auto font-mono text-[11px] tabular-nums text-muted">
                {formatPrice(row.price)}
              </span>
              <span
                className={`w-14 text-right font-mono text-[10px] tabular-nums ${up ? "text-up" : "text-down"}`}
              >
                {up ? "+" : ""}
                {row.change24h.toFixed(2)}%
              </span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function HeadlinesRail() {
  const posts = useHeadlines(true);
  const items = posts.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <aside className="side-rail side-rail-right" aria-label="Latest headlines">
      <p className="side-rail-label">Latest on the wire</p>
      <ul className="side-rail-list">
        {items.map((post) => {
          const { headline } = splitHeadline(post.text);
          return (
            <li key={post.id} className="side-rail-headline">
              <a href={storyPath(post.id)} className="side-rail-link group">
                <time className="font-mono text-[9px] uppercase tracking-[0.12em] text-subtle">
                  {formatTime(post.publishedAt)}
                </time>
                <span className="mt-0.5 line-clamp-2 block font-news text-[12.5px] leading-snug text-muted transition-colors duration-[var(--motion-quick)] group-hover:text-azure">
                  {headline}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export function SideRails() {
  return (
    <>
      <MarketRail />
      <HeadlinesRail />
    </>
  );
}
