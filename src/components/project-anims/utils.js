import gsap from "gsap";

// Shared vocabulary for every project animation, so all nine read as one family.
//
// Ground rules:
//  - The SVG markup IS the poster frame. Every timeline starts from it at t=0
//    and returns to it (visually) at t=duration, so loops are seamless.
//  - Only transforms, opacity, stroke-dashoffset and cheap SVG attributes are
//    animated. Text "typing" and counters are done with per-glyph opacity and
//    stacked variants rather than callbacks, so scrubbing/rewinding is safe.

export const C = {
  ink: "#0a0a0a",
  g1: "#e5e7eb",
  g2: "#cbd5e1",
  g3: "#94a3b8",
  g4: "#52525b",
  white: "#ffffff",
};

export const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

export const EASE = {
  move: "power2.inOut",
  snap: "back.out(1.6)",
  out: "power2.out",
  in: "power2.in",
  linear: "none",
};

// Stroke presets (spread onto SVG elements).
export const LINE = { strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round" };
export const HAIR = { strokeWidth: 1, strokeLinecap: "round", strokeLinejoin: "round" };

// Spread onto any path/line/polyline/rect that `drawLine` will reveal. The
// normalised pathLength means no measuring at build time, and the "1 2"
// dash pattern keeps the hidden state free of round-cap dots.
export const DRAW = { pathLength: 1, strokeDasharray: "1 2", strokeDashoffset: 1 };

export const CARD_SHADOW = {
  rest: "6px 6px 0 0 rgba(10,10,10,0.06)",
  hover: "12px 12px 0 0 rgba(10,10,10,0.18)",
};

export function createTimeline() {
  return gsap.timeline({
    paused: true,
    repeat: -1,
    defaults: { ease: EASE.move, duration: 0.3 },
  });
}

// Pads the timeline to exactly `duration` seconds so every iteration has the
// intended length, and flags any tween that spills over the loop point.
export function seal(tl, duration) {
  if (import.meta.env.DEV && tl.duration() > duration + 1e-3) {
    console.warn(`[project-anims] timeline runs ${tl.duration().toFixed(2)}s, expected ${duration}s`);
  }
  tl.set({}, {}, duration);
  return tl;
}

export function show(tl, targets, at, vars = {}) {
  return tl.to(targets, { opacity: 1, duration: 0.25, ease: EASE.out, ...vars }, at);
}

export function hide(tl, targets, at, vars = {}) {
  return tl.to(targets, { opacity: 0, duration: 0.25, ease: EASE.in, ...vars }, at);
}

// Scale-in "snap" for elements hidden (opacity 0) in the poster.
export function pop(tl, targets, at, { from = 0.5, duration = 0.35, origin = "50% 50%", ...vars } = {}) {
  return tl.fromTo(
    targets,
    { opacity: 0, scale: from, transformOrigin: origin },
    { opacity: 1, scale: 1, transformOrigin: origin, duration, ease: EASE.snap, immediateRender: false, ...vars },
    at,
  );
}

// Brief scale bump that returns to rest within its own duration.
export function pulse(tl, targets, at, { scale = 1.18, duration = 0.36, origin = "50% 50%", ...vars } = {}) {
  return tl.to(
    targets,
    { scale, transformOrigin: origin, duration: duration / 2, ease: EASE.out, yoyo: true, repeat: 1, ...vars },
    at,
  );
}

// Reveals a stroke drawn with the DRAW preset. Undo it with `hide` (fading
// out reads softer than retracting and never leaves a cap dot behind).
export function drawLine(tl, targets, at, { duration = 0.4, ease = EASE.move, ...vars } = {}) {
  return tl
    .set(targets, { opacity: 1 }, at)
    .to(targets, { attr: { "stroke-dashoffset": 0 }, duration, ease, ...vars }, at);
}

// Types the glyphs of a <Typed> element in one after another.
export function typeText(tl, glyphs, at, { each = 0.05 } = {}) {
  return tl.to(glyphs, { attr: { "fill-opacity": 1 }, duration: 0.01, stagger: each, ease: EASE.linear }, at);
}

export function eraseText(tl, glyphs, at, { duration = 0.25, ...vars } = {}) {
  return tl.to(glyphs, { attr: { "fill-opacity": 0 }, duration, ease: EASE.in, ...vars }, at);
}

// Shows exactly one of a set of stacked variants (counters, readouts).
export function swap(tl, variants, index, at) {
  const els = gsap.utils.toArray(variants);
  tl.set(els, { opacity: 0 }, at);
  return tl.set(els[index], { opacity: 1 }, at);
}

// Moves an element through a list of [x, y] translations at constant speed
// along the polyline; `ease` shapes the journey as a whole.
export function travel(tl, target, points, at, { duration = 0.6, ease = EASE.linear } = {}) {
  let run = 0;
  const marks = points.map((p, i) => (run += i ? Math.hypot(p[0] - points[i - 1][0], p[1] - points[i - 1][1]) : 0));
  const total = run || 1;
  const keyframes = { easeEach: EASE.linear };
  points.forEach(([x, y], i) => {
    keyframes[`${((marks[i] / total) * 100).toFixed(2)}%`] = { x, y };
  });
  return tl.to(target, { keyframes, ease, duration }, at);
}
