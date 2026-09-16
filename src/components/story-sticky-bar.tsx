import { useEffect, useRef, useState, type RefObject } from "react";
import { ShareBar } from "@/components/share-bar";
import { cn } from "@/lib/utils";

export function StoryStickyBar({
  title,
  path,
  sentinelRef,
}: {
  title: string;
  path: string;
  /** Element to observe — bar shows after this scrolls out of view (the story headline) */
  sentinelRef: RefObject<HTMLElement | null>;
}) {
  const [visible, setVisible] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  // Sit just under the sticky site header (logo + desks + clocks)
  useEffect(() => {
    const measure = () => {
      const header = document.querySelector("header.glass-header") as HTMLElement | null;
      setHeaderOffset(header ? header.getBoundingClientRect().height : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    const timer = window.setInterval(measure, 1000);
    return () => {
      window.removeEventListener("resize", measure);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show once the headline has scrolled above the sticky header
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < headerOffset);
      },
      {
        threshold: 0,
        rootMargin: `-${Math.max(headerOffset, 8)}px 0px 0px 0px`,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [sentinelRef, headerOffset]);

  return (
    <div
      ref={barRef}
      aria-hidden={!visible}
      style={{ top: headerOffset }}
      className={cn(
        "fixed inset-x-0 z-30 border-b border-border bg-bg/95 shadow-sm backdrop-blur-md transition-[transform,opacity] duration-[var(--motion-fast)] ease-[var(--ease-out)] md:left-12",
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
