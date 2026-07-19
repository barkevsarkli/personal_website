import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Apple-grade smooth scrolling. Lenis interpolates the scroll position every
// frame and drives GSAP's ScrollTrigger from the same RAF loop, so scroll-linked
// animations (the neural wavefront, reveals, parallax) stay perfectly in sync.

let lenis = null;
const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function initSmoothScroll() {
  // Honour reduced-motion: fall back to the browser's native scroll.
  if (prefersReduced) return null;

  lenis = new Lenis({
    duration: 1.15,
    // easeOutExpo — long, smooth deceleration like Apple's product pages.
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  // Keep ScrollTrigger's idea of scroll position in lock-step with Lenis.
  lenis.on("scroll", ScrollTrigger.update);

  const raf = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    lenis.destroy();
    lenis = null;
  };
}

// Smoothly scroll to an element id (used by the navbar / hero CTAs).
export function scrollToId(id, opts = {}) {
  const el = typeof id === "string" ? document.getElementById(id) : id;
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.2, ...opts });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
