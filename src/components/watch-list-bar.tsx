import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { readWatchList, type WatchDesk } from "@/lib/watch-list";

export function WatchListBar() {
  const [list, setList] = useState<WatchDesk[]>([]);

  useEffect(() => {
    setList(readWatchList());
    const onChange = () => setList(readWatchList());
    window.addEventListener("asp-watch-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("asp-watch-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  if (list.length === 0) return null;

  return (
    <section className="mt-8 rounded-xl border border-border bg-surface/60 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
          <Star className="size-3.5 text-azure" strokeWidth={1.8} />
          My desk
        </span>
        {list.map((item) => (
          <Link
            key={item.slug}
            to="/$slug"
            params={{ slug: item.slug }}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-azure hover:bg-azure/10 hover:text-azure"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
