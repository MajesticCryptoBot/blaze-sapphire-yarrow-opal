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
        "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium",
        on
          ? "border-azure bg-surface text-azure"
          : "border-border bg-surface text-muted",
      )}
    >
      <Star className={cn("size-4", on && "fill-current")} strokeWidth={1.8} />
      {on ? "On My desk" : "Watch desk"}
    </button>
  );
}
