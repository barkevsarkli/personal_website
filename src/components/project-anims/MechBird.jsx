import { forwardRef } from "react";
import gsap from "gsap";
import AnimStage from "./AnimStage";
import { Label } from "./parts";
import { C, EASE, HAIR, LINE, createTimeline, hide, seal } from "./utils";

const DURATION = 4;
const RUN = { start: 0.1, length: 3.8, samples: 120, turns: 2 };

// Crank-rocker four-bar (Grashof: s + l = 11 + 36 <= p + q = 35 + 14).
const O2 = { x: 150, y: 128 }; // crank pivot = big gear centre
const O4 = { x: 170, y: 98 }; // rocker pivot = shoulder
const R2 = 11; // crank
const R3 = 35; // coupler
const R4 = 14; // rocker
const WING = 80; // spar length, rigid with the rocker
const DELTA = -194.4; // spar angle relative to the rocker arm (deg)
const PINION = { x: 126, y: 140, r: 9 }; // drives the 18-radius gear 2:1

const deg = (r) => (r * 180) / Math.PI;
const rad = (d) => (d * Math.PI) / 180;

// Solves the linkage for crank angle `th`: crank pin A, coupler/rocker joint B,
// rocker angle phi and the resulting wing angle psi.
function pose(th) {
  const A = { x: O2.x + R2 * Math.cos(th), y: O2.y + R2 * Math.sin(th) };
  const dx = O4.x - A.x;
  const dy = O4.y - A.y;
  const d = Math.hypot(dx, dy);
  const a = (R3 * R3 - R4 * R4 + d * d) / (2 * d);
  const h = Math.sqrt(R3 * R3 - a * a);
  const px = A.x + (a * dx) / d;
  const py = A.y + (a * dy) / d;
  const B = { x: px - (h * dy) / d, y: py + (h * dx) / d };
  const phi = deg(Math.atan2(B.y - O4.y, B.x - O4.x));
  return { A, B, phi, psi: phi + DELTA };
}

// Poster: wing about two-thirds up on the up-stroke.
const THETA0 = (() => {
  let best = 0;
  let err = Infinity;
  for (let k = 0; k < 360; k++) {
    const th = rad(k);
    const p = pose(th);
    const rising = pose(th + 0.01).phi > p.phi;
    const e = Math.abs(p.phi - 70);
    if (rising && e < err) {
      err = e;
      best = th;
    }
  }
  return best;
})();
const P0 = pose(THETA0);

const polar = (o, angDeg, r) => ({ x: o.x + Math.cos(rad(angDeg)) * r, y: o.y + Math.sin(rad(angDeg)) * r });
const pt = (p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;

function gearPath(cx, cy, rOut, rRoot, teeth) {
  const pts = [];
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const w = (Math.PI * 2) / teeth;
    [
      [a, rRoot],
      [a + w * 0.18, rOut],
      [a + w * 0.5, rOut],
      [a + w * 0.68, rRoot],
    ].forEach(([ang, r]) => pts.push(`${(cx + Math.cos(ang) * r).toFixed(2)} ${(cy + Math.sin(ang) * r).toFixed(2)}`));
  }
  return `M${pts.join(" L")} Z`;
}

function build(q) {
  const tl = createTimeline();
  const ease = gsap.parseEase("power1.inOut");
  const dt = RUN.length / RUN.samples;
  const samples = [];
  for (let i = 1; i <= RUN.samples; i++) {
    const th = THETA0 + RUN.turns * Math.PI * 2 * ease(i / RUN.samples);
    samples.push(pose(th));
  }

  // Gear train: rotation is linear in crank angle, so one eased tween matches the samples.
  tl.to(q("[data-gear]"), { rotation: 360 * RUN.turns, svgOrigin: `${O2.x} ${O2.y}`, duration: RUN.length, ease: "power1.inOut" }, RUN.start);
  tl.to(q("[data-pinion]"), { rotation: -720 * RUN.turns, svgOrigin: `${PINION.x} ${PINION.y}`, duration: RUN.length, ease: "power1.inOut" }, RUN.start);

  // Coupler and wing follow the solved linkage, frame by frame.
  tl.to(
    q("[data-coupler]"),
    { keyframes: samples.map((s) => ({ attr: { x1: s.A.x, y1: s.A.y, x2: s.B.x, y2: s.B.y }, duration: dt, ease: EASE.linear })) },
    RUN.start,
  );
  tl.to(q("[data-joint]"), { keyframes: samples.map((s) => ({ attr: { cx: s.B.x, cy: s.B.y }, duration: dt, ease: EASE.linear })) }, RUN.start);
  tl.to(
    q("[data-wing]"),
    { keyframes: samples.map((s) => ({ rotation: s.phi - P0.phi, svgOrigin: `${O4.x} ${O4.y}`, duration: dt, ease: EASE.linear })) },
    RUN.start,
  );

  // Dotted wingtip trace, laid down during the first flap.
  q("[data-trace]").forEach((dot, k) => tl.set(dot, { opacity: 1 }, RUN.start + (k * 3 + 1) * dt));
  hide(tl, q("[data-trace]"), 3.45, { duration: 0.4 });
  return seal(tl, DURATION);
}

// Trace dots: wingtip positions sampled over the first cycle.
const TRACE = (() => {
  const ease = gsap.parseEase("power1.inOut");
  const dots = [];
  for (let i = 1; i <= RUN.samples / RUN.turns; i += 3) {
    const th = THETA0 + RUN.turns * Math.PI * 2 * ease(i / RUN.samples);
    dots.push(polar(O4, pose(th).psi, WING));
  }
  return dots;
})();

export default forwardRef(function MechBird(_, ref) {
  const psi = P0.psi;
  const tip = polar(O4, psi, WING);
  const membrane = [O4, tip, polar(O4, psi - 13, 70), polar(O4, psi - 22, 56), polar(O4, psi - 32, 42), polar(O4, psi - 44, 28), polar(O4, psi - 58, 16)];

  return (
    <AnimStage
      ref={ref}
      viewBox="0 0 320 180"
      label="Side view of a mechanical bird: a gear train turns a crank that drives a four-bar linkage, flapping the wing through two cycles while a dotted line traces the wingtip path."
      build={build}
    >
      {/* bird */}
      <path d="M100 116 L62 100 L70 118 L60 132 L100 126 Z" fill={C.white} stroke={C.ink} {...LINE} />
      <path d="M150 145 L146 162 M142 162 H150 M172 145 L176 162 M172 162 H180" stroke={C.ink} {...LINE} />
      <ellipse cx="158" cy="122" rx="64" ry="24" fill={C.white} stroke={C.ink} {...LINE} />
      <circle cx="228" cy="104" r="13" fill={C.white} stroke={C.ink} {...LINE} />
      <path d="M240 100 L256 105 L240 110" fill={C.white} stroke={C.ink} {...LINE} />
      <circle cx="231" cy="101" r="1.8" fill={C.ink} />

      {/* drive train, seen through a cut-away */}
      <circle cx="140" cy="128" r="30" stroke={C.g2} strokeDasharray="2 3" {...HAIR} />
      <rect x="115" y="129" width="22" height="22" rx="3" fill={C.g1} />
      <g data-pinion>
        <path d={gearPath(PINION.x, PINION.y, PINION.r, PINION.r - 2.2, 8)} fill={C.white} stroke={C.g4} strokeWidth="1.25" strokeLinejoin="round" />
        <circle cx={PINION.x} cy={PINION.y} r="2" fill={C.g4} />
      </g>
      <g data-gear>
        <path d={gearPath(O2.x, O2.y, 18, 15.5, 16)} fill={C.white} stroke={C.g4} strokeWidth="1.25" strokeLinejoin="round" />
        <circle cx={O2.x} cy={O2.y} r="2.5" fill={C.g4} />
        <line x1={O2.x} y1={O2.y} x2={P0.A.x} y2={P0.A.y} stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={P0.A.x} cy={P0.A.y} r="2.2" fill={C.white} stroke={C.ink} strokeWidth="1.25" />
      </g>
      <line data-coupler x1={P0.A.x} y1={P0.A.y} x2={P0.B.x} y2={P0.B.y} stroke={C.ink} strokeWidth="2" strokeLinecap="round" />

      {TRACE.map((p, i) => (
        <circle key={i} data-trace cx={p.x} cy={p.y} r="1.1" fill={C.g4} opacity="0" />
      ))}

      {/* wing + rocker: one rigid body pivoting at the shoulder */}
      <g data-wing>
        <line x1={O4.x} y1={O4.y} x2={P0.B.x} y2={P0.B.y} stroke={C.ink} strokeWidth="2" strokeLinecap="round" />
        <path d={`M${membrane.map(pt).join(" L")} Z`} fill={C.g1} stroke={C.ink} strokeWidth="1.5" strokeLinejoin="round" />
        <line x1={O4.x} y1={O4.y} x2={tip.x} y2={tip.y} stroke={C.ink} strokeWidth="2" strokeLinecap="round" />
      </g>
      <circle data-joint cx={P0.B.x} cy={P0.B.y} r="2" fill={C.white} stroke={C.ink} strokeWidth="1.25" />
      <circle cx={O4.x} cy={O4.y} r="2.6" fill={C.ink} />

      <Label x={14} y={172} size={5.5} fill={C.g3} letterSpacing="1">
        CRANK-ROCKER · 2:1 GEAR
      </Label>
    </AnimStage>
  );
});
