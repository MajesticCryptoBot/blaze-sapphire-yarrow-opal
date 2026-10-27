import { useEffect, useRef } from "react";

/**
 * Ambient editorial background — the modern "depth" layer behind every page.
 *
 * Three soft color fields and a fine grid sit behind the content. Each layer
 * carries a `data-depth` factor and is translated against scroll position
 * (rAF-throttled, transform-only → compositor work, no repaints), so slower
 * layers trail behind faster ones and the page gains a subtle parallax depth
 * exactly like premium editorial sites. The blobs also breathe with a slow CSS
 * drift that is independent of scroll.
 *
 * Purely decorative: `aria-hidden`, `pointer-events-none`, sits under the app
 * shell, and every transform is skipped when the visitor prefers reduced
 * motion.
 */
export function AmbientBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]"));
    let raf = 0;
    let latestY = window.scrollY;

    const apply = () => {
      raf = 0;
      for (const layer of layers) {
        const depth = Number(layer.dataset.depth ?? "0.1");
        layer.style.transform = `translate3d(0, ${(-latestY * depth).toFixed(1)}px, 0)`;
      }
    };
    const schedule = () => {
      latestY = window.scrollY;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden className="ambient-bg">
      <div className="ambient-parallax" data-depth="0.05">
        <div className="ambient-blob ambient-blob-a" />
      </div>
      <div className="ambient-parallax" data-depth="0.11">
        <div className="ambient-blob ambient-blob-b" />
      </div>
      <div className="ambient-parallax" data-depth="0.18">
        <div className="ambient-blob ambient-blob-c" />
      </div>
      <div className="ambient-parallax" data-depth="0.03">
        <div className="ambient-grid" />
      </div>
      <div className="ambient-vignette" />
    </div>
  );
}
