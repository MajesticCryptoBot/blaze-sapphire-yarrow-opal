import { useEffect, useRef } from "react";

/**
 * Fixed, multi-layer atmospheric background that gently shifts on scroll.
 * Bold colorful version with visible parallax + ambient drift.
 */
export function SiteBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        el.style.setProperty("--bg-shift", `${y * 0.12}px`);
        el.style.setProperty("--bg-shift-slow", `${y * 0.055}px`);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="site-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="site-bg-base absolute inset-0" />

      <div className="site-bg-orb site-bg-orb-1 absolute" />
      <div className="site-bg-orb site-bg-orb-2 absolute" />
      <div className="site-bg-orb site-bg-orb-3 absolute" />
      <div className="site-bg-orb site-bg-orb-4 absolute" />

      <div className="site-bg-noise absolute inset-0" />
      <div className="site-bg-vignette absolute inset-0" />
    </div>
  );
}
