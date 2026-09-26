import { useEffect, useRef } from "react";
import gsap from "gsap";

// Shared stage for the project story animations.
//
// Each scene hands in its SVG artwork plus a `build(tl, step, el)` function that
// scripts a 10–15s GSAP timeline on it. The Scene takes care of the rest:
//  - the timeline loops, but only plays while the card is on screen;
//  - `step(i, at)` cross-fades the caption for story step `i` at time `at`;
//  - a hairline progress bar tracks the loop;
//  - reduced-motion users get a single, paused frame (`still`, 0→1).
//
// Every timeline must end in the same state it starts in (scenes fade their
// `.scene` group out at the end) so the loop is seamless.
export const INK = "#0a0a0a";
export const MID = "#94a3b8";
export const LINE = "#cbd5e1";
export const SOFT = "#e5e7eb";
export const MONO = "JetBrains Mono, ui-monospace, monospace";

export default function Scene({ steps = [], build, still = 0.7, viewBox = "0 0 320 140", children }) {
  const root = useRef(null);
  const bar = useRef(null);

  useEffect(() => {
    const el = root.current;
    let tl;

    const ctx = gsap.context(() => {
      tl = gsap.timeline({
        paused: true,
        repeat: -1,
        onUpdate: () => {
          if (bar.current) bar.current.style.transform = `scaleX(${tl.progress()})`;
        },
      });

      const caps = gsap.utils.toArray(".pv-cap", el);
      tl.set(caps, { autoAlpha: 0, y: 4 }, 0);
      const step = (i, at) =>
        tl.to(caps, { autoAlpha: (j) => (j === i ? 1 : 0), y: (j) => (j === i ? 0 : -4), duration: 0.35, ease: "power2.out" }, at);

      build(tl, step, el);
    }, el);

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      tl.progress(still).pause();
      return () => ctx.revert();
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? tl.play() : tl.pause()),
      { threshold: 0.2 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      ctx.revert();
    };
    // The timeline is scripted once; captions re-render with the language
    // without needing a rebuild.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={root}
      className="pv-stage relative mb-5 h-48 w-full overflow-hidden rounded-xl border border-[#0a0a0a]/10 bg-gradient-to-br from-zinc-50 to-zinc-100 sm:h-60"
    >
      <svg
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-x-0 top-0 h-[calc(100%-2rem)] w-full"
        aria-hidden="true"
      >
        {children}
      </svg>

      <div className="absolute inset-x-4 bottom-3 h-4 font-mono text-[11px] uppercase tracking-widest text-zinc-500">
        {steps.map((s, i) => (
          <span key={i} className="pv-cap invisible absolute left-0 top-0 whitespace-nowrap">
            <span className="text-[#0a0a0a]">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-zinc-400">/{String(steps.length).padStart(2, "0")}</span>
            <span className="mx-2 text-zinc-300">·</span>
            {s}
          </span>
        ))}
      </div>

      <div
        ref={bar}
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[#0a0a0a]/70"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
