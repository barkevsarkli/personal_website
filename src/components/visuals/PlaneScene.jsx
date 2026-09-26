import Scene, { INK, LINE, MID, SOFT, MONO } from "./Scene";

// Aircraft Design — front view. Outline → mesh → lift load bends the wings →
// solver iterates → a stress map shows the peak at the wing roots.
const CX = 160;
const CY = 64;
const FR = 15; // fuselage radius
const SPAN = 132;
const DIV = 12;

// Wing geometry for one side (sgn = ±1) at deflection `d` (tip rise, px).
const wingAt = (sgn, s, d) => {
  const x = CX + sgn * (FR + s * (SPAN - FR));
  const y = CY + 6 - 5 * s - d * s * s;
  const t = 7 * (1 - s) + 2.4 * s;
  return { x, top: y - t / 2, mid: y, bot: y + t / 2 };
};

function outline(sgn, d) {
  const pts = Array.from({ length: DIV + 1 }, (_, i) => wingAt(sgn, i / DIV, d));
  const top = pts.map((p) => `${p.x.toFixed(1)},${p.top.toFixed(1)}`);
  const bot = pts.reverse().map((p) => `${p.x.toFixed(1)},${p.bot.toFixed(1)}`);
  return `M${top.join(" L")} L${bot.join(" L")} Z`;
}

// Wing elements: DIV spanwise × 2 (upper/lower skin). Bending stress ∝ (1-s)².
const ELEMS = [];
[-1, 1].forEach((sgn) => {
  for (let i = 0; i < DIV; i++)
    ["top", "bot"].forEach((side) => ELEMS.push({ sgn, i, side, stress: (1 - (i + 0.5) / DIV) ** 2 }));
});
function quad({ sgn, i, side }, d) {
  const a = wingAt(sgn, i / DIV, d);
  const b = wingAt(sgn, (i + 1) / DIV, d);
  return `M${a.x.toFixed(1)} ${a[side].toFixed(1)} L${b.x.toFixed(1)} ${b[side].toFixed(1)} L${b.x.toFixed(1)} ${b.mid.toFixed(1)} L${a.x.toFixed(1)} ${a.mid.toFixed(1)} Z`;
}

const ARROWS = [];
[-1, 1].forEach((sgn) => [0.3, 0.55, 0.8, 1].forEach((s) => ARROWS.push({ sgn, s })));

function build(tl, step, el) {
  const wings = el.querySelectorAll(".wing-outline");
  const elems = el.querySelectorAll(".el");
  const arrows = el.querySelectorAll(".arrow");
  const engines = el.querySelectorAll(".engine");
  const iterEl = el.querySelector(".iter");
  const resEl = el.querySelector(".res");
  const s = { d: 0, iter: 0 };

  const shape = () => {
    wings.forEach((w, k) => w.setAttribute("d", outline(k ? 1 : -1, s.d)));
    elems.forEach((e, k) => e.setAttribute("d", quad(ELEMS[k], s.d)));
    arrows.forEach((a, k) => {
      const { sgn, s: sp } = ARROWS[k];
      const p = wingAt(sgn, sp, s.d);
      a.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.top.toFixed(1)})`);
    });
    engines.forEach((e, k) => {
      const p = wingAt(k ? 1 : -1, 0.4, s.d);
      e.setAttribute("transform", `translate(${p.x.toFixed(1)} ${(p.bot + 5).toFixed(1)})`);
    });
  };
  const counter = () => {
    const n = Math.round(s.iter);
    iterEl.textContent = `iter ${String(n).padStart(2, "0")}`;
    resEl.textContent = `res 1e-${Math.min(6, 1 + Math.floor(n / 8))}`;
  };
  shape();

  tl.set(s, { d: 0, iter: 0, onComplete: () => (shape(), counter()) }, 0)
    .set(".draw", { strokeDashoffset: 1 }, 0)
    .set(".body-fill", { opacity: 0 }, 0)
    .set(".el", { opacity: 0, fillOpacity: 0 }, 0)
    .set(".hub-mesh", { opacity: 0 }, 0)
    .set(".arrow", { opacity: 0 }, 0)
    .set(".solver, .legend, .peak", { opacity: 0 }, 0)
    .fromTo(".scene", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);

  // 1 — CAD outline traces in.
  step(0, 0.2);
  tl.to(".draw", { strokeDashoffset: 0, duration: 1.3, stagger: 0.15, ease: "power2.inOut" }, 0.3)
    .to(".body-fill", { opacity: 1, duration: 0.4 }, 1.4);

  // 2 — mesh: elements sweep out from the root to the tips.
  step(1, 2.2);
  tl.to(".el", { opacity: 1, duration: 0.2, stagger: (i) => ELEMS[i].i * 0.09 }, 2.3)
    .to(".hub-mesh", { opacity: 1, duration: 0.4 }, 2.3);

  // 3 — lift load: arrows appear and the wings bend upward.
  step(2, 4.1);
  tl.to(".arrow", { opacity: 1, duration: 0.3, stagger: 0.05 }, 4.2)
    .to(s, { d: 12, duration: 1.4, ease: "power2.inOut", onUpdate: shape }, 4.6);

  // 4 — solve: iterations tick, residual drops.
  step(3, 6.2);
  tl.to(".solver", { opacity: 1, duration: 0.3 }, 6.2)
    .to(s, { iter: 48, duration: 2.0, ease: "power1.out", onUpdate: counter }, 6.3)
    .to(s, { d: 9, duration: 0.5, ease: "power1.inOut", yoyo: true, repeat: 1, onUpdate: shape }, 6.4);

  // 5 — stress map: skins shade by bending stress, peak at the roots.
  step(4, 8.6);
  tl.to(".arrow", { opacity: 0.35, duration: 0.4 }, 8.6)
    .to(".el", { fillOpacity: (i) => 0.08 + ELEMS[i].stress * 0.92, duration: 0.5, stagger: (i) => (DIV - ELEMS[i].i) * 0.05 }, 8.7)
    .to(".legend", { opacity: 1, duration: 0.4 }, 9.3)
    .to(".peak", { opacity: 1, duration: 0.4 }, 9.9);

  tl.to(".scene", { opacity: 0, duration: 0.6 }, 12.4);
}

export default function PlaneScene({ steps }) {
  return (
    <Scene steps={steps} build={build} still={0.9}>
      <defs>
        <linearGradient id="pv-stress" x1="0" x2="1">
          <stop offset="0" stopColor={INK} stopOpacity="0.08" />
          <stop offset="1" stopColor={INK} />
        </linearGradient>
      </defs>
      <g className="scene">
        {/* tailplane + fin (behind) */}
        <path className="draw" d={`M${CX - 44} ${CY - 6} H${CX + 44}`} stroke={MID} strokeWidth="2.5" strokeLinecap="round" pathLength="1" strokeDasharray="1" />
        <path
          className="draw"
          d={`M${CX - 3} ${CY - FR + 1} L${CX - 1.5} ${CY - FR - 26} H${CX + 1.5} L${CX + 3} ${CY - FR + 1}`}
          fill="none"
          stroke={INK}
          strokeWidth="1.4"
          pathLength="1"
          strokeDasharray="1"
        />

        {/* wings */}
        {[-1, 1].map((sgn) => (
          <path key={sgn} className="wing-outline draw" fill="#fff" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" pathLength="1" strokeDasharray="1" />
        ))}
        {ELEMS.map((e, i) => (
          <path key={i} className="el" fill={INK} stroke={LINE} strokeWidth="0.5" />
        ))}

        {/* engines */}
        {[-1, 1].map((sgn) => (
          <g key={sgn} className="engine">
            <circle r="6" fill="#fff" stroke={INK} strokeWidth="1.4" />
            <circle r="2.5" fill={INK} />
          </g>
        ))}

        {/* fuselage */}
        <circle className="body-fill" cx={CX} cy={CY} r={FR} fill="#fff" />
        <g className="hub-mesh" stroke={LINE} strokeWidth="0.6">
          <circle cx={CX} cy={CY} r={FR * 0.55} fill="none" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <line key={i} x1={CX + Math.cos(a) * FR * 0.55} y1={CY + Math.sin(a) * FR * 0.55} x2={CX + Math.cos(a) * FR} y2={CY + Math.sin(a) * FR} />;
          })}
        </g>
        <circle className="draw" cx={CX} cy={CY} r={FR} fill="none" stroke={INK} strokeWidth="1.6" pathLength="1" strokeDasharray="1" />

        {/* lift arrows ride on the upper skin */}
        {ARROWS.map((_, i) => (
          <g key={i} className="arrow">
            <path d="M0 -3 V-15 M-2.6 -11.5 L0 -15 L2.6 -11.5" fill="none" stroke={INK} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}

        {/* peak stress callout at the right wing root */}
        <g className="peak">
          <line x1={CX + FR + 4} y1={CY + 12} x2={CX + FR + 16} y2={CY + 28} stroke={INK} strokeWidth="0.8" />
          <text x={CX + FR + 18} y={CY + 32} fontFamily={MONO} fontSize="6.5" fill={INK}>
            σmax 212 MPa
          </text>
        </g>

        {/* solver + legend strip */}
        <g className="solver" fontFamily={MONO} fontSize="6.5">
          <text className="iter" x="14" y="118" fill={INK}>
            iter 00
          </text>
          <text className="res" x="58" y="118" fill={MID}>
            res 1e-1
          </text>
        </g>
        <g className="legend" fontFamily={MONO} fontSize="6">
          <rect x="222" y="112" width="70" height="5" rx="1" fill="url(#pv-stress)" stroke={SOFT} strokeWidth="0.5" />
          <text x="222" y="126" fill={MID}>
            0
          </text>
          <text x="292" y="126" textAnchor="end" fill={MID}>
            212 MPa
          </text>
        </g>
      </g>
    </Scene>
  );
}
