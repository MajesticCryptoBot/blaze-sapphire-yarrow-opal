import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { isWatched, readWatchList, toggleWatch } from "@/lib/watch-list";
import { cn } from "@/lib/utils";

export function WatchToggle({ slug, label }: { slug: string; label: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(isWatched(slug));
    const sync = () => setOn(isWatched(slug, readWatchList()));
    window.addEventListener("asp-watch-changed", sync);
    return () => window.removeEventListener("asp-watch-changed", sync);
  }, [slug]);

  return (
    <button
      type="button"
      onClick={() => {
        const next = toggleWatch(slug, label);
        setOn(next.some((item) => item.slug === slug));
      }}
      aria-pressed={on}
      aria-label={on ? `Remove ${label} from My desk` : `Add ${label} to My desk`}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-[background-color,border-color,color] duration-[var(--motion-quick)]",
        on
          ? "border-azure/40 bg-azure/10 text-azure"
          : "border-border text-muted hover:border-azure hover:bg-azure/10 hover:text-azure",
      )}
    >
      <Star className={cn("size-4", on && "fill-current")} strokeWidth={1.8} />
      {on ? "On My desk" : "Watch desk"}
    </button>
  );
}
