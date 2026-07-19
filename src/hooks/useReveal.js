import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Apple-style scroll motion, scoped to `scopeRef`:
//  - `.reveal-line` inside a `.mask` slides up into view (clipped).
//  - `.reveal` elements fade/scale/de-blur in, batched + staggered.
//  - `[data-speed]` elements drift at parallax speeds while their section scrolls.
export function useReveal(scopeRef) {
  useEffect(() => {
    if (!scopeRef.current) return;
    const ctx = gsap.context(() => {
      // Batched fade/scale/blur reveals (staggered as a group enters).
      // `expo.out` gives the long, soft deceleration that reads as "Apple-smooth".
      ScrollTrigger.batch(".reveal", {
        start: "top 90%",
        onEnter: (els) =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.08,
            overwrite: true,
          }),
        onLeaveBack: (els) =>
          gsap.to(els, {
            opacity: 0,
            y: 28,
            scale: 0.99,
            filter: "blur(4px)",
            duration: 0.5,
            ease: "power2.inOut",
            overwrite: true,
          }),
      });

      // Parallax drift.
      gsap.utils.toArray("[data-speed]").forEach((el) => {
        const speed = parseFloat(el.dataset.speed) || 0;
        gsap.to(el, {
          yPercent: -speed * 14,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") || el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      ScrollTrigger.refresh();
    }, scopeRef);
    return () => ctx.revert();
  }, [scopeRef]);
}
