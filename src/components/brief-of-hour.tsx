import { useMemo } from "react";
import { splitHeadline, type TelegramPost } from "@/lib/telegram-feed";
import { storyPath } from "@/lib/story-url";

function deskTake(headline: string, dek: string): string {
  const text = `${headline} ${dek}`.toLowerCase();
  if (/\b(fomc|fed|rate cut|rate hike|powell)\b/.test(text)) {
    return "Policy tape in focus — rate path surprises reprice yields, the dollar, and crypto risk in the same window.";
  }
  if (/\b(cpi|inflation|pce|ppi)\b/.test(text)) {
    return "Inflation print territory — hotter data tends to firm yields; cooler data usually supports risk assets including Bitcoin.";
  }
  if (/\b(etf|inflow|outflow|blackrock|grayscale)\b/.test(text)) {
    return "Flow story — ETF and institutional lines often set the tone for BTC and the broader complex into the close.";
  }
  if (/\b(sec|cftc|lawsuit|regulation|ban)\b/.test(text)) {
    return "Regulatory headline — policy risk cuts both ways; clarity usually helps, surprises usually hurt risk appetite.";
  }
  if (/\b(bitcoin|btc)\b/.test(text)) {
    return "Bitcoin on the lead — majors still set beta for alts when the tape is binary.";
  }
  if (/\b(ethereum|ether|eth|solana|xrp)\b/.test(text)) {
    return "Alt and L1 tape — watch whether majors confirm or fade the move.";
  }
  if (/\b(ai|openai|nvidia|model)\b/.test(text)) {
    return "AI / tech crossover — equity narratives can spill into crypto risk when liquidity is thin.";
  }
  return "Watch whether the follow-through holds into the next session and how majors price the headline.";
}

export function BriefOfHour({ post }: { post: TelegramPost | null }) {
  const content = useMemo(() => {
    if (!post) return null;
    const { headline, dek } = splitHeadline(post.text);
    return {
      headline,
      dek: dek || headline,
      take: deskTake(headline, dek || headline),
      href: storyPath(post.id),
      at: post.publishedAt,
    };
  }, [post]);

  if (!content) return null;

  return (
    <section className="mt-8 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">Brief of the hour</p>
      <a href={content.href} className="group mt-3 block">
        <h2 className="font-display text-xl font-medium transition-colors group-hover:text-azure sm:text-2xl">
          {content.headline}
        </h2>
        <p className="mt-2 font-news text-[15px] leading-[1.6] text-muted line-clamp-2">{content.dek}</p>
      </a>
      <div className="mt-4 border-t border-border pt-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">Desk take</p>
        <p className="mt-1.5 font-news text-[15px] leading-[1.6] text-foreground">{content.take}</p>
      </div>
    </section>
  );
}
