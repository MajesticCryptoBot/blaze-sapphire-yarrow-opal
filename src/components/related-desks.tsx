import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { DESK_SECTIONS, matchesDesk } from "@/lib/desk-sections";

/** Desks that are useful as "also on this tape" destinations (skip meta desks). */
const SKIP = new Set(["news", "videos", "fun-facts", "top-movers", "international"]);

export function RelatedDesks({ text }: { text: string }) {
  const desks = useMemo(() => {
    const post = { text };
    return DESK_SECTIONS.filter((section) => {
      if (SKIP.has(section.slug)) return false;
      if (section.patterns.length === 0) return false;
      return matchesDesk(post, section);
    }).slice(0, 5);
  }, [text]);

  if (desks.length === 0) return null;

  return (
    <section className="mt-10 border-t border-border pt-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
        Also on this tape
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {desks.map((desk) => (
          <Link
            key={desk.slug}
            to="/$slug"
            params={{ slug: desk.slug }}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-azure hover:bg-azure/10 hover:text-azure"
          >
            {desk.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
