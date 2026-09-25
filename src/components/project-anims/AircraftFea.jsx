import { forwardRef } from "react";
import AnimStage from "./AnimStage";
import { Label } from "./parts";
import { C, DRAW, EASE, LINE, MONO, createTimeline, drawLine, hide, pop, seal, show } from "./utils";

const DURATION = 4;
const X0 = 26;
const X1 = 294;
const XS = X0 + 0.42 * (X1 - X0); // wing-box support
const N = 16; // columns
const M = 4; // rows
const TAIL_DROOP = 24;
const NOSE_DROOP = 7;

const halfHeight = (t) => {
  if (t < 0.14) {
    const s = t / 0.14;
    return 20 * Math.sqrt(s * (2 - s));
  }
  if (t < 0.55) return 20;
  return 20 - 13 * ((t - 0.55) / 0.45) ** 1.2;
};
const centreline = (t) => (t < 0.5 ? 96 : 96 - 16 * ((t - 0.5) / 0.5) ** 1.6);

// Undeformed nodes, row-major by column: index = i * (M + 1) + j.
const NODES = [];
for (let i = 0; i <= N; i++) {
  const t = Math.max(0.012, i / N);
  const x = X0 + t * (X1 - X0);
  for (let j = 0; j <= M; j++) NODES.push({ x, y: centreline(t) + (j / M - 0.5) * 2 * halfHeight(t), v: j / M });
}
const id = (i, j) => i * (M + 1) + j;

// Vertical deflection at x for load factor k (exaggerated beam bending).
const deflect = (x, k) =>
  x > XS ? k * TAIL_DROOP * ((x - XS) / (X1 - XS)) ** 2 : k * NOSE_DROOP * ((XS - x) / (XS - X0)) ** 2;

// Bending stress ~ moment(x) * distance from the neutral axis; peaks at the support.
const stressAt = (x, v) => {
  const m = x > XS ? ((X1 - x) / (X1 - XS)) ** 1.5 : 0.4 * ((x - X0) / (XS - X0)) ** 1.5;
  return m * (1 + 0.35 * Math.exp(-(((x - XS) / 14) ** 2))) * Math.abs(2 * v - 1);
};

const TRIS = [];
for (let i = 0; i < N; i++) {
  for (let j = 0; j < M; j++) {
    TRIS.push([id(i, j), id(i + 1, j), id(i + 1, j + 1)], [id(i, j), id(i + 1, j + 1), id(i, j + 1)]);
  }
}
const RAW = TRIS.map((t) => {
  const cx = t.reduce((s, n) => s + NODES[n].x, 0) / 3;
  const cv = t.reduce((s, n) => s + NODES[n].v, 0) / 3;
  return stressAt(cx, cv);
});
const PEAK = Math.max(...RAW);
const STRESS = RAW.map((s) => s / PEAK);

const ARROWS = [212, 232, 252];
const topAt = (x) => {
  const t = (x - X0) / (X1 - X0);
  return centreline(t) - halfHeight(t);
};
const HOT = { x: XS, y: topAt(XS) };

const fmt = (n) => n.toFixed(1);
const triPoints = (t, k) => t.map((n) => `${fmt(NODES[n].x)},${fmt(NODES[n].y + deflect(NODES[n].x, k))}`).join(" ");
const edgePoints = (j, k) =>
  Array.from({ length: N + 1 }, (_, i) => NODES[id(i, j)])
    .map((n) => `${fmt(n.x)},${fmt(n.y + deflect(n.x, k))}`)
    .join(" ");

function build(q) {
  const tl = createTimeline();
  const tris = q("[data-tri]");
  const edges = q("[data-edge]");
  const fin = q("[data-fin]")[0];
  const arrows = q("[data-arrow]");
  const state = { k: 0, f: 0 };

  const render = () => {
    const { k, f } = state;
    tris.forEach((el, i) => {
      el.setAttribute("points", triPoints(TRIS[i], k));
      el.setAttribute("fill-opacity", (f * STRESS[i] * 0.85).toFixed(3));
    });
    edges.forEach((el, e) => el.setAttribute("points", edgePoints(e ? M : 0, k)));
    fin.setAttribute("transform", `translate(0 ${fmt(deflect(X1, k))})`);
    arrows.forEach((el, a) => el.setAttribute("transform", `translate(0 ${fmt(deflect(ARROWS[a], k))})`));
  };

  // Load: arrows land, the fuselage bends, the stress field builds up.
  const arrowShapes = q("[data-arrow-shape]");
  pop(tl, arrowShapes, 0.2, { from: 0.4, origin: "50% 0%", stagger: 0.08 });
  tl.to(state, { k: 1, duration: 1.2, ease: EASE.move, onUpdate: render }, 0.5);
  tl.to(state, { f: 1, duration: 1.1, ease: EASE.move, onUpdate: render }, 0.6);
  pop(tl, q("[data-hot]"), 1.55, { duration: 0.3 });
  drawLine(tl, q("[data-leader]"), 1.65, { duration: 0.25 });
  show(tl, q("[data-sigma]"), 1.8, { duration: 0.2 });

  // Release: arrows lift off, the mesh springs back, the field fades.
  hide(tl, arrowShapes, 2.6, { duration: 0.2 });
  tl.to(state, { k: 0, duration: 1.1, ease: "elastic.out(1, 0.5)", onUpdate: render }, 2.65);
  tl.to(state, { f: 0, duration: 0.7, ease: EASE.out, onUpdate: render }, 2.65);
  hide(tl, q("[data-hot], [data-leader], [data-sigma]"), 2.9, { duration: 0.3 });
  return seal(tl, DURATION);
}

export default forwardRef(function AircraftFea(_, ref) {
  const tailTop = NODES[id(N, 0)];
  return (
    <AnimStage
      ref={ref}
      viewBox="0 0 320 180"
      label="Triangulated fuselage mesh under load: arrows push on the tail, the mesh bends and a grey stress field peaks at the wing root with a sigma max callout, then the load releases and the mesh relaxes."
      build={build}
    >
      {/* stress legend */}
      {[0.1, 0.3, 0.5, 0.7, 0.9].map((o, i) => (
        <rect key={o} x={262 + i * 8} y="18" width="8" height="5" fill={C.ink} fillOpacity={o * 0.85} />
      ))}
      <rect x="262" y="18" width="40" height="5" stroke={C.g3} strokeWidth="0.5" />
      <Label x={258} y={23} size={6} fill={C.g4} anchor="end">
        σ
      </Label>

      <g data-fin>
        <path
          d={`M${tailTop.x - 30} ${tailTop.y} L${tailTop.x - 6} ${tailTop.y - 30} L${tailTop.x + 2} ${tailTop.y - 30} L${tailTop.x} ${tailTop.y + 1}`}
          fill={C.white}
          stroke={C.ink}
          {...LINE}
          strokeWidth={1.5}
        />
      </g>

      {TRIS.map((t, i) => (
        <polygon key={i} data-tri points={triPoints(t, 0)} fill={C.ink} fillOpacity="0" stroke={C.g3} strokeWidth="0.6" strokeLinejoin="round" />
      ))}
      {[0, M].map((j) => (
        <polyline key={j} data-edge points={edgePoints(j, 0)} stroke={C.ink} {...LINE} strokeWidth={1.5} />
      ))}

      {/* wing-box support */}
      <path d={`M${XS} 117 l-7 11 h14 Z`} fill={C.white} stroke={C.ink} {...LINE} strokeWidth={1.5} />
      <path d={`M${XS - 10} 131 h20 M${XS - 8} 131 l-3 4 M${XS - 2} 131 l-3 4 M${XS + 4} 131 l-3 4 M${XS + 10} 131 l-3 4`} stroke={C.g4} strokeWidth="1" strokeLinecap="round" />

      {ARROWS.map((x) => (
        <g key={x} data-arrow>
          <g opacity="0" data-arrow-shape>
            <path d={`M${x} ${topAt(x) - 26} V${topAt(x) - 4} M${x - 3.5} ${topAt(x) - 8} L${x} ${topAt(x) - 3} L${x + 3.5} ${topAt(x) - 8}`} stroke={C.ink} {...LINE} />
          </g>
        </g>
      ))}

      <circle data-hot cx={HOT.x} cy={HOT.y} r="4.5" stroke={C.ink} strokeWidth="1.5" fill={C.white} fillOpacity="0" opacity="0" />
      <path data-leader d={`M${HOT.x - 3} ${HOT.y - 4} L${HOT.x - 20} ${HOT.y - 30} H${HOT.x - 70}`} stroke={C.ink} strokeWidth="1" strokeLinecap="round" {...DRAW} opacity="0" />
      <text data-sigma x={HOT.x - 70} y={HOT.y - 34} fontFamily={MONO} fontSize="7" fontWeight="600" fill={C.ink} opacity="0">
        σ max 212 MPa
      </text>

      <Label x={14} y={172} size={5.5} fill={C.g3} letterSpacing="1">
        FEA · STATIC · TAIL LOAD
      </Label>
    </AnimStage>
  );
});
