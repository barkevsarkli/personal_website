import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CARD_SHADOW, EASE } from "./utils";

const HOVER_INTENT_MS = 120;
const TOUCH_VIEW_RATIO = 0.6;
// When leaving mid-loop, scrub back to the poster if it's this close (in
// timeline seconds); otherwise dip-fade to it so we never fast-rewind a whole story.
const SCRUB_WINDOW = 1.2;

// Only one project animation plays at a time across the whole page.
let active = null;

const media = (q) => typeof window !== "undefined" && window.matchMedia?.(q).matches;

// Drives a project card: hover/focus expansion + looping animation on pointer
// devices, play-once-in-view on touch, poster-only for reduced motion.
export default function useCardMotion() {
  const cardRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;

    const reduced = media("(prefers-reduced-motion: reduce)");
    const touch = media("(hover: none)");

    let intent = 0;
    let restTween = null;
    let hovered = false;
    let focused = false;
    let expanded = false;
    let armed = true;

    const anim = () => animRef.current;
    const svg = () => anim()?.svg();

    const expand = () => {
      expanded = true;
      if (reduced) {
        gsap.set(card, { boxShadow: CARD_SHADOW.hover });
        return;
      }
      gsap.to(card, {
        scale: 1.04,
        y: -4,
        boxShadow: CARD_SHADOW.hover,
        zIndex: 10,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const collapse = () => {
      if (!expanded) return;
      expanded = false;
      if (reduced) {
        gsap.set(card, { clearProps: "boxShadow" });
        return;
      }
      gsap.to(card, {
        scale: 1,
        y: 0,
        boxShadow: CARD_SHADOW.rest,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
        onComplete: () => gsap.set(card, { clearProps: "transform,boxShadow,zIndex" }),
      });
    };

    const self = {
      // Instant reset, used when another card takes over or we scroll away.
      stop() {
        restTween?.kill();
        restTween = null;
        const tl = anim()?.timeline(false);
        if (tl) tl.pause().time(0);
        if (svg()) gsap.set(svg(), { opacity: 1 });
        if (active === self) active = null;
      },
    };

    const start = (loop) => {
      if (reduced || !anim()) return;
      if (active && active !== self) active.stop();
      active = self;
      restTween?.kill();
      gsap.set(svg(), { opacity: 1 });
      const tl = anim().timeline();
      if (!tl) return;
      // time(0) (not restart()) so callback-driven frames re-render too.
      tl.pause().time(0);
      if (loop) {
        tl.play();
      } else {
        restTween = gsap.to(tl, {
          time: tl.duration(),
          duration: tl.duration(),
          ease: "none",
          onComplete: () => self.stop(),
        });
      }
    };

    const rest = () => {
      const tl = anim()?.timeline(false);
      if (!tl) return;
      if (active === self) active = null;
      tl.pause();
      restTween?.kill();
      const d = tl.duration();
      const t = tl.time();
      if (t <= SCRUB_WINDOW || d - t <= SCRUB_WINDOW) {
        restTween = gsap.to(tl, {
          time: t < d - t ? 0 : d,
          duration: 0.4,
          ease: EASE.move,
          onComplete: () => tl.time(0),
        });
      } else {
        restTween = gsap
          .timeline()
          .to(svg(), { opacity: 0.2, duration: 0.16, ease: EASE.in })
          .add(() => tl.time(0))
          .to(svg(), { opacity: 1, duration: 0.24, ease: EASE.out });
      }
    };

    const engage = () => {
      clearTimeout(intent);
      intent = window.setTimeout(() => {
        expand();
        start(true);
      }, HOVER_INTENT_MS);
    };

    const release = () => {
      if (hovered || focused) return;
      clearTimeout(intent);
      collapse();
      rest();
    };

    const onEnter = (e) => {
      if (e.pointerType === "touch") return;
      hovered = true;
      engage();
    };
    const onLeave = (e) => {
      if (e.pointerType === "touch") return;
      hovered = false;
      release();
    };
    const onFocus = () => {
      if (!card.matches(":focus-visible")) return;
      focused = true;
      engage();
    };
    const onBlur = () => {
      focused = false;
      release();
    };

    if (!touch) {
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);
    }
    card.addEventListener("focus", onFocus);
    card.addEventListener("blur", onBlur);

    // Pause offscreen; on touch devices, autoplay once when mostly in view.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          armed = true;
          if (active === self) self.stop();
          return;
        }
        if (touch && armed && entry.intersectionRatio >= TOUCH_VIEW_RATIO) {
          armed = false;
          start(false);
        }
      },
      { threshold: [0, TOUCH_VIEW_RATIO] },
    );
    io.observe(card);

    return () => {
      clearTimeout(intent);
      io.disconnect();
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
      card.removeEventListener("focus", onFocus);
      card.removeEventListener("blur", onBlur);
      restTween?.kill();
      if (active === self) active = null;
      gsap.killTweensOf(card);
      gsap.set(card, { clearProps: "transform,boxShadow,zIndex" });
    };
  }, []);

  return { cardRef, animRef };
}
