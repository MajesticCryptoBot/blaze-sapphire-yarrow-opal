import { useEffect, useRef } from "react";

/**
 * Ambient editorial background — the premium "depth" stage behind every page.
 *
 * Layer stack (back to front):
 *   1. Wash — static radial spotlights from the top corners and a faint
 *      counter-glow from below: the stage lighting.
 *   2. Aurora ribbons — three long, soft gradient bands that drift slowly and
 *      parallax at different scroll speeds (depths 0.06 → 0.19).
 *   3. Dot matrix — a fine masked dot grid that trails the auroras slightly.
 *   4. Particles — fourteen small glowing motes, each at its own depth
 *      (0.05 → 0.26) with an independent float animation, so the field has
 *      real parallax "volume" while you scroll.
 *   5. Grain + vignette — static texture and edge falloff for the finish.
 *
 * Every moving layer is transform-only (rAF-throttled, compositor-friendly,
 * no repaints). Purely decorative: `aria-hidden`, `pointer-events-none`,
 * sits under the app shell, and all motion is skipped when the visitor
 * prefers reduced motion.
 */

/** Deterministic pseudo-random in [0, 1) — stable across renders/reloads. */
function hash(a: number, b: number): number {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: 3 + hash(i, 1) * 94,
  top: 3 + hash(i, 2) * 90,
  size: 2 + hash(i, 3) * 4.5,
  depth: 0.05 + hash(i, 4) * 0.21,
  duration: 9 + hash(i, 5) * 13,
  delay: -hash(i, 6) * 22,
}));

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
      <div className="ambient-wash" />

      <div className="ambient-parallax" data-depth="0.06">
        <div className="ambient-aurora ambient-aurora-a" />
      </div>
      <div className="ambient-parallax" data-depth="0.12">
        <div className="ambient-aurora ambient-aurora-b" />
      </div>
      <div className="ambient-parallax" data-depth="0.19">
        <div className="ambient-aurora ambient-aurora-c" />
      </div>

      <div className="ambient-parallax" data-depth="0.04">
        <div className="ambient-dots" />
      </div>

      {PARTICLES.map((p, i) => (
        <div key={i} className="ambient-parallax" data-depth={p.depth.toFixed(2)}>
          <span
            className="ambient-particle"
            style={
              {
                "--x": p.left.toFixed(2),
                "--y": p.top.toFixed(2),
                "--s": p.size.toFixed(2),
                "--dur": `${p.duration.toFixed(2)}s`,
                "--delay": `${p.delay.toFixed(2)}s`,
              } as React.CSSProperties
            }
          />
        </div>
      ))}

      <div className="ambient-grain" />
      <div className="ambient-vignette" />
    </div>
  );
}
