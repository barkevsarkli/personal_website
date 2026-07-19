import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { signals } from "../three/signals";

// Build a real multi-layer network for the splash mark.
const LAYERS = [4, 6, 6, 3];
const XS = [45, 140, 235, 300];
const GAP = 23;

function buildNet() {
  const layerNodes = [];
  LAYERS.forEach((n, li) => {
    const nodes = [];
    for (let i = 0; i < n; i++) {
      nodes.push({ x: XS[li], y: 100 + (i - (n - 1) / 2) * GAP });
    }
    layerNodes.push(nodes);
  });
  const nodes = layerNodes.flat();
  const edges = [];
  for (let li = 0; li < LAYERS.length - 1; li++) {
    layerNodes[li].forEach((a) =>
      layerNodes[li + 1].forEach((b) =>
        edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, sx: (a.x + b.x) / 2 })
      )
    );
  }
  edges.sort((p, q) => p.sx - q.sx); // left -> right for the pulse stagger
  nodes.sort((p, q) => p.x - q.x);
  return { nodes, edges };
}

const NET = buildNet();

export default function Splash() {
  const [show, setShow] = useState(true);
  const root = useRef(null);
  const bar = useRef(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = prevOverflow;
          signals.inputStarted = true; // kick off the MNIST pixel-input reveal
          setShow(false);
        },
      });

      tl.to(".snn-edge", {
        strokeDashoffset: 0,
        duration: 0.45,
        ease: "power2.out",
        stagger: { each: 0.006 },
      })
        .from(
          ".snn-node",
          { scale: 0, transformOrigin: "center", duration: 0.35, ease: "back.out(2)", stagger: { each: 0.015 } },
          "-=0.4"
        )
        // Gradient-update pulse sweeping left -> right through the network.
        .to(
          ".snn-edge",
          { stroke: "#0a0a0a", duration: 0.14, stagger: { each: 0.009 }, yoyo: true, repeat: 1 },
          "+=0.02"
        )
        .to(
          ".snn-node",
          { fill: "#0a0a0a", duration: 0.14, stagger: { each: 0.03 }, yoyo: true, repeat: 1 },
          "<"
        )
        .from(".splash-title", { y: 16, opacity: 0, duration: 0.5, ease: "power3.out" }, "-=0.8")
        .from(".splash-sub", { y: 12, opacity: 0, duration: 0.45, ease: "power3.out" }, "-=0.45")
        .to(bar.current, { scaleX: 1, duration: 0.6, ease: "power1.inOut" }, "-=0.5")
        .to(".splash-mark, .splash-text", { y: -14, opacity: 0, duration: 0.45, ease: "power2.in" }, "+=0.05")
        .to(root.current, { yPercent: -100, duration: 0.75, ease: "power4.inOut" }, "-=0.2");
    }, root);

    return () => {
      document.body.style.overflow = prevOverflow;
      ctx.revert();
    };
  }, []);

  if (!show) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
    >
      <div className="splash-mark">
        <svg viewBox="0 0 345 200" className="w-[320px] max-w-[80vw]" fill="none">
          {NET.edges.map((e, i) => (
            <line
              key={i}
              className="snn-edge"
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke="#d4d4d8"
              strokeWidth="1"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="1"
            />
          ))}
          {NET.nodes.map((n, i) => (
            <circle
              key={i}
              className="snn-node"
              cx={n.x}
              cy={n.y}
              r="5"
              fill="#ffffff"
              stroke="#0a0a0a"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      <div className="splash-text mt-8 flex flex-col items-center">
        <div className="splash-title text-2xl font-bold tracking-tight text-[#0a0a0a]">
          Barkev Şarklı
        </div>
        <div className="splash-sub mt-1.5 font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">
          Computer · AI · Mechatronics
        </div>
        <div className="mt-7 h-px w-44 overflow-hidden bg-zinc-200">
          <div ref={bar} className="h-full origin-left scale-x-0 bg-[#0a0a0a]" />
        </div>
      </div>
    </div>
  );
}
