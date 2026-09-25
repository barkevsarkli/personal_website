import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

// Shared shell for every project animation: renders the poster SVG and owns a
// gsap.context. The timeline itself is built lazily (first hover / first time
// in view) via `build(q, svg)` and reverted with the context on unmount.
const AnimStage = forwardRef(function AnimStage({ viewBox, label, build, children }, ref) {
  const svgRef = useRef(null);
  const ctxRef = useRef(null);
  const tlRef = useRef(null);

  useLayoutEffect(() => {
    ctxRef.current = gsap.context(() => {}, svgRef);
    // Dev-only hook so automated frame captures can seek the timeline exactly.
    if (import.meta.env.DEV) svgRef.current.__timeline = () => tlRef.current;
    return () => {
      ctxRef.current.revert();
      ctxRef.current = null;
      tlRef.current = null;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      svg: () => svgRef.current,
      // Returns the timeline, building it on first use unless `create` is false.
      timeline(create = true) {
        const ctx = ctxRef.current;
        if (!tlRef.current && create && ctx) {
          ctx.add(() => {
            tlRef.current = build(gsap.utils.selector(svgRef), svgRef.current);
          });
        }
        return tlRef.current;
      },
    }),
    [build],
  );

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={label}
      fill="none"
      className="h-full w-full"
    >
      {children}
    </svg>
  );
});

export default AnimStage;
