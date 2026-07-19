import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Smooth, Apple-style section entrance: the content simply rises, fades, and
// de-blurs into place. (Replaces the old "seed node zoom" pop-up.)
// The `origin` prop is accepted but ignored, so existing call sites keep working.
export default function Pop({ children }) {
  const root = useRef(null);

  useEffect(() => {
    // Reduced-motion: show instantly, no transform.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const content = root.current.querySelector(".pop-content");
      gsap.set(content, { y: 40, opacity: 0, filter: "blur(8px)" });

      ScrollTrigger.create({
        trigger: root.current,
        start: "top 82%",
        once: true,
        onEnter: () =>
          gsap.to(content, {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "expo.out",
          }),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative">
      <div className="pop-content">{children}</div>
    </div>
  );
}
