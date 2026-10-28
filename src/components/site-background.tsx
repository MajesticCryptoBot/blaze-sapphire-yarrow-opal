import { useEffect, useRef } from "react";

/** Generate a stable field of stars for CSS layers */
function buildStarLayer(
  count: number,
  size: number,
  seed: number,
): string {
  const parts: string[] = [];
  let s = seed;
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = 0; i < count; i++) {
    const x = (rand() * 100).toFixed(2);
    const y = (rand() * 100).toFixed(2);
    const o = (0.35 + rand() * 0.65).toFixed(2);
    parts.push(`${x}vw ${y}vh 0 ${size}px rgba(255,255,255,${o})`);
  }
  return parts.join(",");
}

const STARS_FAR = buildStarLayer(90, 0.6, 42);
const STARS_MID = buildStarLayer(55, 1.0, 137);
const STARS_NEAR = buildStarLayer(28, 1.4, 911);

/**
 * Fixed multi-layer atmospheric background + parallax starfield.
 * Blue / cyan only (no purple). Stars drift with scroll like Grok on X.
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
        // Orbs
        el.style.setProperty("--bg-shift", `${y * 0.1}px`);
        el.style.setProperty("--bg-shift-slow", `${y * 0.045}px`);
        // Stars – different speeds for depth (Grok/X style)
        el.style.setProperty("--stars-far", `${y * 0.04}px`);
        el.style.setProperty("--stars-mid", `${y * 0.09}px`);
        el.style.setProperty("--stars-near", `${y * 0.16}px`);
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

      {/* Soft blue / cyan orbs */}
      <div className="site-bg-orb site-bg-orb-1 absolute" />
      <div className="site-bg-orb site-bg-orb-2 absolute" />
      <div className="site-bg-orb site-bg-orb-3 absolute" />

      {/* Parallax star layers */}
      <div
        className="site-bg-stars site-bg-stars-far absolute inset-0"
        style={{ boxShadow: STARS_FAR }}
      />
      <div
        className="site-bg-stars site-bg-stars-mid absolute inset-0"
        style={{ boxShadow: STARS_MID }}
      />
      <div
        className="site-bg-stars site-bg-stars-near absolute inset-0"
        style={{ boxShadow: STARS_NEAR }}
      />

      <div className="site-bg-noise absolute inset-0" />
      <div className="site-bg-vignette absolute inset-0" />
    </div>
  );
}
