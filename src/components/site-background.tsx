import { useEffect, useRef } from "react";

/**
 * Build a starfield using layered box-shadows.
 * Each star has a bright core + soft glow.
 */
function buildStarLayer(
  count: number,
  coreSize: number,
  seed: number,
): string {
  const parts: string[] = [];
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  for (let i = 0; i < count; i++) {
    const x = (rand() * 100).toFixed(2);
    const y = (rand() * 220).toFixed(2);
    const o = (0.45 + rand() * 0.55).toFixed(2);
    const glow = (coreSize * (1.8 + rand() * 1.4)).toFixed(1);
    parts.push(`${x}vw ${y}vh 0 ${coreSize}px rgba(255,255,255,${o})`);
    parts.push(
      `${x}vw ${y}vh 0 ${glow}px rgba(180,220,255,${(Number(o) * 0.35).toFixed(2)})`,
    );
  }
  return parts.join(",");
}

const STARS_FAR = buildStarLayer(63, 0.55, 42);
const STARS_MID = buildStarLayer(38, 0.9, 137);
const STARS_NEAR = buildStarLayer(20, 1.25, 911);

/**
 * Fixed pure-dark background + parallax starfield only (no color orbs).
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
