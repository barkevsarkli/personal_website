import Scene, { INK, LINE, MID, MONO } from "./Scene";

// Mechanical Bird — motor → 1:2.5 gear train → crank → four-bar linkage →
// flapping wing. The wing is driven by an actual crank-rocker solution, so the
// coupler keeps a constant length as the crank turns.
const G1 = [46, 84]; // motor pinion
const G2 = [70, 70]; // driven gear (crank)
const R1 = 9;
const R2 = 22;
const RATIO = 2.5;
const CRANK = 13;
const PIVOT = [196, 74]; // wing / rocker pivot on the bird's back
const ROCKER = 20;
const COUPLER = Math.hypot(PIVOT[0] - G2[0], PIVOT[1] - G2[1]);
const WING = 62;

const rad = (d) => (d * Math.PI) / 180;

// Crank angle (deg) → crank pin A and rocker tip B.
function solve(theta) {
  const A = [G2[0] + CRANK * Math.cos(rad(theta)), G2[1] + CRANK * Math.sin(rad(theta))];
  const dx = PIVOT[0] - A[0];
  const dy = PIVOT[1] - A[1];
  const d = Math.hypot(dx, dy);
  const a = (COUPLER ** 2 - ROCKER ** 2 + d ** 2) / (2 * d);
  const h = Math.sqrt(Math.max(0, COUPLER ** 2 - a ** 2));
  const mx = A[0] + (a * dx) / d;
  const my = A[1] + (a * dy) / d;
  // Take the branch above the pivot line.
  const B = [mx + (h * dy) / d, my - (h * dx) / d];
  const rocker = Math.atan2(B[1] - PIVOT[1], B[0] - PIVOT[0]);
  return { A, B, rocker };
}

// Offset so the middle of the rocker's swing points the wing up and back.
const SWING = Array.from({ length: 72 }, (_, i) => solve(i * 5).rocker);
const MID_ROCKER = (Math.min(...SWING) + Math.max(...SWING)) / 2;
const WING_OFFSET = rad(-118) - MID_ROCKER;
const TIP = (r) => [PIVOT[0] + WING * Math.cos(r + WING_OFFSET), PIVOT[1] + WING * Math.sin(r + WING_OFFSET)];
const ARC = (() => {
  const [lo, hi] = [Math.min(...SWING), Math.max(...SWING)];
  const [x1, y1] = TIP(lo);
  const [x2, y2] = TIP(hi);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${WING} ${WING} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
})();

function gear(cx, cy, r, teeth) {
  const pts = [];
  for (let i = 0; i < teeth * 4; i++) {
    const a = (i / (teeth * 4)) * Math.PI * 2;
    const rr = i % 4 < 2 ? r : r * 0.8;
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(2)},${(cy + Math.sin(a) * rr).toFixed(2)}`);
  }
  return pts.join(" ");
}

function build(tl, step, el) {
  const $ = (s) => el.querySelector(s);
  const g1 = $(".g1");
  const g2 = $(".g2");
  const crank = $(".crank-arm");
  const pin = $(".pin");
  const coupler = $(".coupler");
  const rocker = $(".rocker");
  const wing = $(".wing");
  const s = { theta: -90 };

  const pose = () => {
    const { A, B, rocker: r } = solve(s.theta);
    g2.setAttribute("transform", `rotate(${s.theta} ${G2[0]} ${G2[1]})`);
    g1.setAttribute("transform", `rotate(${-s.theta * RATIO} ${G1[0]} ${G1[1]})`);
    crank.setAttribute("x2", A[0]);
    crank.setAttribute("y2", A[1]);
    pin.setAttribute("cx", A[0]);
    pin.setAttribute("cy", A[1]);
    coupler.setAttribute("x1", A[0]);
    coupler.setAttribute("y1", A[1]);
    coupler.setAttribute("x2", B[0]);
    coupler.setAttribute("y2", B[1]);
    rocker.setAttribute("x2", B[0]);
    rocker.setAttribute("y2", B[1]);
    wing.setAttribute("transform", `rotate(${((r + WING_OFFSET) * 180) / Math.PI} ${PIVOT[0]} ${PIVOT[1]})`);
  };
  pose();

  tl.set(s, { theta: -90, onComplete: pose }, 0)
    .set(".motor", { opacity: 0, x: -10 }, 0)
    .set(".p-g1, .p-g2, .p-crank, .p-link, .p-bird, .arc, .ratio", { opacity: 0 }, 0)
    .set(".p-g2", { scale: 0.7, transformOrigin: "50% 50%" }, 0)
    .set(".coupler", { strokeDashoffset: 1 }, 0)
    .fromTo(".scene", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);

  // Crank angle over the whole loop: slow while assembling, then flying.
  tl.to(s, { theta: -90 + 360 * 3, duration: 6.4, ease: "power1.in", onUpdate: pose }, 0.9)
    .to(s, { theta: -90 + 360 * 9, duration: 5.4, ease: "none", onUpdate: pose }, 7.3);

  step(0, 0.2);
  tl.to(".motor", { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, 0.3)
    .to(".p-g1", { opacity: 1, duration: 0.4 }, 0.7);

  step(1, 1.9);
  tl.to(".p-g2", { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" }, 2.0)
    .to(".ratio", { opacity: 1, duration: 0.4 }, 2.5);

  step(2, 3.6);
  tl.to(".p-crank", { opacity: 1, duration: 0.4 }, 3.7);

  step(3, 5.0);
  tl.to(".p-link", { opacity: 1, duration: 0.3 }, 5.1)
    .to(".coupler", { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 5.1);

  step(4, 6.8);
  tl.to(".p-bird", { opacity: 1, duration: 0.6 }, 6.9)
    .to(".arc", { opacity: 1, duration: 0.6 }, 8.0);

  tl.to(".scene", { opacity: 0, duration: 0.6 }, 12.4);
}

export default function GearScene({ steps }) {
  return (
    <Scene steps={steps} build={build} still={0.75}>
      <g className="scene">
        {/* ground link (frame) */}
        <line className="p-link" x1={G2[0]} y1={G2[1]} x2={PIVOT[0]} y2={PIVOT[1]} stroke={LINE} strokeWidth="1" strokeDasharray="3 3" />

        {/* motor + pinion */}
        <g className="motor">
          <rect x="8" y="73" width="26" height="22" rx="3" fill={INK} />
          <text x="21" y="87" textAnchor="middle" fontFamily={MONO} fontSize="8" fontWeight="600" fill="#fff">
            M
          </text>
          <line x1="34" y1={G1[1]} x2={G1[0]} y2={G1[1]} stroke={INK} strokeWidth="2" />
        </g>
        <g className="p-g1">
          <g className="g1">
            <polygon points={gear(G1[0], G1[1], R1, 8)} fill={MID} />
            <circle cx={G1[0]} cy={G1[1]} r="2.5" fill="#fff" />
          </g>
        </g>

        {/* driven gear */}
        <g className="p-g2">
          <g className="g2">
            <polygon points={gear(G2[0], G2[1], R2, 20)} fill={INK} />
            <circle cx={G2[0]} cy={G2[1]} r="15" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="1" />
            <circle cx={G2[0]} cy={G2[1]} r="3.5" fill="#fff" />
          </g>
        </g>
        <text className="ratio" x={G2[0]} y={G2[1] + 36} textAnchor="middle" fontFamily={MONO} fontSize="6.5" fill={MID}>
          1 : {RATIO}
        </text>

        {/* crank */}
        <g className="p-crank">
          <line className="crank-arm" x1={G2[0]} y1={G2[1]} stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* bird */}
        <g className="p-bird">
          <path className="arc" d={ARC} fill="none" stroke={LINE} strokeWidth="1" strokeDasharray="2 3" />
          <polygon points="186,82 164,70 168,88" fill={INK} />
          <ellipse cx="214" cy="86" rx="30" ry="12" fill={INK} />
          <circle cx="246" cy="76" r="9" fill={INK} />
          <polygon points="254,74 266,78 254,80" fill={MID} />
          <circle cx="249" cy="74" r="1.6" fill="#fff" />
          <g className="wing">
            <path
              d={`M${PIVOT[0]} ${PIVOT[1] - 4} L${PIVOT[0] + WING - 8} ${PIVOT[1] - 6} Q${PIVOT[0] + WING + 4} ${PIVOT[1]} ${PIVOT[0] + WING - 10} ${PIVOT[1] + 5} L${PIVOT[0]} ${PIVOT[1] + 4} Z`}
              fill={MID}
              stroke={INK}
              strokeWidth="1.2"
            />
            {[16, 28, 40].map((x) => (
              <line key={x} x1={PIVOT[0] + x} y1={PIVOT[1] - 4.5} x2={PIVOT[0] + x + 6} y2={PIVOT[1] + 4.5} stroke={INK} strokeWidth="0.8" />
            ))}
          </g>
        </g>

        {/* linkage: coupler + rocker, drawn on top */}
        <g className="p-link">
          <line className="coupler" stroke={INK} strokeWidth="2" strokeLinecap="round" pathLength="1" strokeDasharray="1" />
          <line className="rocker" x1={PIVOT[0]} y1={PIVOT[1]} stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <circle cx={PIVOT[0]} cy={PIVOT[1]} r="3" fill="#fff" stroke={INK} strokeWidth="1.5" />
        </g>
        <circle className="pin p-crank" r="3" fill="#fff" stroke={INK} strokeWidth="1.5" />
      </g>
    </Scene>
  );
}
