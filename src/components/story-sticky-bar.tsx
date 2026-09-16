import { useEffect, useRef, useState } from "react";
import { ShareBar } from "@/components/share-bar";
import { cn } from "@/lib/utils";

export function StoryStickyBar({
  title,
  path,
  sentinelRef,
}: {
  title: string;
  path: string;
  /** Element to observe — bar shows after this scrolls out of view */
  sentinelRef: React.RefObject<HTMLElement | null>;
}) {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar once the headline sentinel leaves the top of the viewport
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0, rootMargin: "-8px 0px 0px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [sentinelRef]);

  return (
    <div
      ref={barRef}
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 top-0 z-30 border-b border-border bg-bg/95 backdrop-blur-md transition-[transform,opacity] duration-[var(--motion-fast)] ease-[var(--ease-out)] md:left-12",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0",
      )}
    >
      <div className="mx-auto flex h-12 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <p className="min-w-0 flex-1 truncate font-display text-sm font-medium text-foreground">
          {title}
        </p>
        <div className="shrink-0">
          <ShareBar title={title} path={path} align="right" />
        </div>
      </div>
    </div>
  );
}
