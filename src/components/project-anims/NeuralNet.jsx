import { forwardRef } from "react";
import AnimStage from "./AnimStage";
import { Label } from "./parts";
import { C, DRAW, EASE, HAIR, MONO, createTimeline, drawLine, hide, pulse, seal, show, swap } from "./utils";

const DURATION = 4;
const LAYERS = [
  { x: 50, ys: [50, 90, 130], name: "in" },
  { x: 138, ys: [36, 72, 108, 144], name: "hidden" },
  { x: 226, ys: [70, 110], name: "out" },
];
const R = 8;

// Deterministic pseudo-random weights so the poster never changes between renders.
const rand = (n) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const EDGES = LAYERS.slice(0, -1).flatMap((L, l) =>
  L.ys.flatMap((y1, a) =>
    LAYERS[l + 1].ys.map((y2, b) => {
      const k = l * 100 + a * 10 + b;
      const w0 = 0.6 + rand(k) * 1.8;
      const w1 = Math.min(2.6, Math.max(0.5, w0 + (rand(k + 7) - 0.5) * 2));
      return { l, x1: L.x + R, y1, x2: LAYERS[l + 1].x - R, y2, w0, w1 };
    }),
  ),
);

const LOSS = [
  { v: "0.82", fill: C.g3 },
  { v: "0.82", fill: C.ink },
  { v: "0.47", fill: C.ink },
  { v: "0.31", fill: C.ink },
];

function build(q) {
  const tl = createTimeline();
  const nodes = (l) => q(`[data-node="${l}"]`);
  const fwd = (l) => q(`[data-fwd="${l}"]`);
  const grad = (l) => q(`[data-grad="${l}"]`);
  const edges = (l) => q(`[data-edge="${l}"]`);
  const loss = q("[data-loss]");

  // Forward pass: a wavefront sweeps left -> right lighting nodes and edges.
  const front = q("[data-front]");
  show(tl, front, 0.1, { duration: 0.15 });
  tl.to(front, { x: LAYERS[2].x - LAYERS[0].x, duration: 1.1, ease: EASE.linear }, 0.1);
  hide(tl, front, 1.1, { duration: 0.15 });
  [0, 1, 2].forEach((l) => {
    const t = 0.15 + l * 0.45;
    tl.to(nodes(l), { attr: { fill: C.ink }, duration: 0.18, stagger: 0.04, ease: EASE.out }, t);
    if (l < 2) drawLine(tl, fwd(l), t + 0.12, { duration: 0.32, ease: EASE.linear });
  });
  swap(tl, loss, 1, 1.2);
  pulse(tl, loss[1], 1.2, { scale: 1.15, origin: "0% 50%" });

  // Backward pass: dashed gradients flow right -> left, weights visibly change.
  hide(tl, [fwd(0), fwd(1)], 1.45, { duration: 0.2 });
  [1, 0].forEach((l, k) => {
    const t = 1.5 + k * 0.55;
    tl.to(nodes(l + 1), { attr: { fill: C.white }, duration: 0.2, stagger: 0.04 }, t);
    show(tl, grad(l), t, { duration: 0.15 });
    tl.to(grad(l), { attr: { "stroke-dashoffset": 15 }, duration: 0.55, ease: EASE.linear }, t);
    hide(tl, grad(l), t + 0.45, { duration: 0.2 });
    edges(l).forEach((e, i) => tl.to(e, { attr: { "stroke-width": EDGES.filter((d) => d.l === l)[i].w1 }, duration: 0.4 }, t + 0.2));
  });
  tl.to(nodes(0), { attr: { fill: C.white }, duration: 0.2, stagger: 0.04 }, 2.6);
  swap(tl, loss, 2, 2.05);
  swap(tl, loss, 3, 2.7);
  pulse(tl, loss[3], 2.7, { scale: 1.15, origin: "0% 50%" });

  // Settle back to the poster: weights return, loss fades back to its idle value.
  [0, 1].forEach((l) =>
    edges(l).forEach((e, i) => tl.to(e, { attr: { "stroke-width": EDGES.filter((d) => d.l === l)[i].w0 }, duration: 0.6 }, 3.15)),
  );
  hide(tl, loss[3], 3.4, { duration: 0.3 });
  show(tl, loss[0], 3.45, { duration: 0.3 });
  return seal(tl, DURATION);
}

export default forwardRef(function NeuralNet(_, ref) {
  return (
    <AnimStage
      ref={ref}
      viewBox="0 0 320 180"
      label="A 3-4-2 neural network: a forward pass lights up nodes left to right and shows the loss, then dashed gradients flow back right to left, edge weights change and the loss drops."
      build={build}
    >
      {EDGES.map((e, i) => (
        <line key={i} data-edge={e.l} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={C.g2} strokeWidth={e.w0} strokeLinecap="round" />
      ))}
      {EDGES.map((e, i) => (
        <line key={i} data-fwd={e.l} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={C.ink} strokeWidth="1.25" strokeLinecap="round" {...DRAW} opacity="0" />
      ))}
      {EDGES.map((e, i) => (
        <line key={i} data-grad={e.l} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={C.ink} strokeWidth="1.1" strokeDasharray="2 3" strokeDashoffset="0" strokeLinecap="round" opacity="0" />
      ))}

      <line data-front x1={LAYERS[0].x} y1="22" x2={LAYERS[0].x} y2="158" stroke={C.g3} strokeDasharray="1 3" {...HAIR} opacity="0" />

      {LAYERS.map((L, l) => (
        <g key={l}>
          {L.ys.map((y) => (
            <circle key={y} data-node={l} cx={L.x} cy={y} r={R} fill={C.white} stroke={C.ink} strokeWidth="1.75" />
          ))}
          <Label x={L.x} y={170} size={5.5} fill={C.g3} anchor="middle" letterSpacing="1">
            {L.name.toUpperCase()}
          </Label>
        </g>
      ))}

      <path d="M240 70 h6 v40 h-6 M246 90 h6" stroke={C.g3} {...HAIR} />
      <Label x={257} y={83} size={6} fill={C.g3}>
        loss
      </Label>
      {LOSS.map((d, i) => (
        <text key={i} data-loss x="257" y="98" fontFamily={MONO} fontSize="11" fontWeight="600" fill={d.fill} opacity={i ? 0 : 1}>
          {d.v}
        </text>
      ))}
    </AnimStage>
  );
});
