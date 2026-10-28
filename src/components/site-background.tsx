import { useEffect, useRef } from "react";

/**
 * Fixed, multi-layer atmospheric background that gently shifts on scroll.
 * Works across all pages. Respects prefers-reduced-motion.
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
        // Subtle parallax: move layers at different rates
        el.style.setProperty("--bg-shift", `${y * 0.08}px`);
        el.style.setProperty("--bg-shift-slow", `${y * 0.035}px`);
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
      {/* Deep base */}
      <div className="site-bg-base absolute inset-0" />

      {/* Soft aurora orbs – parallax */}
      <div className="site-bg-orb site-bg-orb-1 absolute" />
      <div className="site-bg-orb site-bg-orb-2 absolute" />
      <div className="site-bg-orb site-bg-orb-3 absolute" />

      {/* Fine grain / noise for depth */}
      <div className="site-bg-noise absolute inset-0" />

      {/* Very subtle top vignette */}
      <div className="site-bg-vignette absolute inset-0" />
    </div>
  );
}
