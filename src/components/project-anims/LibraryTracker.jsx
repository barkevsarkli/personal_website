import { forwardRef, useId } from "react";
import AnimStage from "./AnimStage";
import { Label } from "./parts";
import { C, EASE, HAIR, LINE, MONO, createTimeline, hide, pop, seal, show, swap } from "./utils";

const DURATION = 5;
const TABLES = [52, 130, 208];
const CAM = { x: 278, y: 30 };
// Seat order per table: top-left, top-right, bottom-left, bottom-right.
const SEATS = TABLES.flatMap((c) => [
  [c - 13, 60, true],
  [c + 13, 60, false],
  [c - 13, 120, true],
  [c + 13, 120, false],
]).map(([x, y, left], i) => ({ i, x, y, left, top: y < 90, angle: (Math.atan2(y - CAM.y, x - CAM.x) * 180) / Math.PI }));

const RESIDENTS = [0, 7, 9, 10]; // occupied in the poster
const VISITORS = [3, 4, 5]; // arrive, get detected, then leave
const CONF = { 0: "0.94", 3: "0.91", 4: "0.88", 5: "0.97", 7: "0.93", 9: "0.95", 10: "0.90" };
const DETECTED = [...RESIDENTS, ...VISITORS];
const COUNTS = ["04", "05", "06", "07"];

// Scan cone sweep range (degrees, SVG space) — covers the whole room.
const A_HI = 178;
const A_LO = 104;
const A_MID = (A_HI + A_LO) / 2; // poster
const SWEEP_1 = [0.6, 2.0];
const SWEEP_2 = [2.4, 3.8];
// Time at which a sweep going from angle `a0` to `a1` passes angle `a`.
const passAt = ([t0, t1], a0, a1, a) => t0 + ((a0 - a) / (a0 - a1)) * (t1 - t0);

function build(q) {
  const tl = createTimeline();
  const cone = q("[data-cone]");
  const count = q("[data-count]");
  const seat = (i) => q(`[data-seat="${i}"]`);
  const person = (i) => q(`[data-person="${i}"]`);
  const box = (i) => q(`[data-box="${i}"]`);

  const origin = `${CAM.x} ${CAM.y}`;
  tl.to(cone, { rotation: A_HI - A_MID, svgOrigin: origin, duration: 0.45 }, 0.15);
  tl.to(cone, { rotation: A_LO - A_MID, svgOrigin: origin, duration: SWEEP_1[1] - SWEEP_1[0], ease: EASE.linear }, SWEEP_1[0]);
  tl.to(cone, { rotation: A_HI - A_MID, svgOrigin: origin, duration: SWEEP_2[1] - SWEEP_2[0], ease: EASE.linear }, SWEEP_2[0]);
  tl.to(cone, { rotation: 0, svgOrigin: origin, duration: 0.6 }, 3.9);

  // First sweep: visitors sit down, every occupied seat gets a box as the cone passes.
  const arrivals = VISITORS.map((i) => passAt(SWEEP_1, A_HI, A_LO, SEATS[i].angle)).sort((a, b) => a - b);
  DETECTED.forEach((i) => {
    const t = passAt(SWEEP_1, A_HI, A_LO, SEATS[i].angle);
    if (VISITORS.includes(i)) {
      pop(tl, person(i), t - 0.25, { duration: 0.3 });
      tl.to(seat(i), { attr: { fill: C.ink }, duration: 0.2, ease: EASE.out }, t + 0.12);
    }
    pop(tl, box(i), t, { from: 1.35, duration: 0.3 });
  });
  arrivals.forEach((t, k) => swap(tl, count, k + 1, t + 0.1));

  // Second sweep back: visitors leave, their boxes dissolve, the count drops.
  const departures = VISITORS.map((i) => passAt(SWEEP_2, A_LO, A_HI, SEATS[i].angle)).sort((a, b) => a - b);
  VISITORS.forEach((i) => {
    const t = passAt(SWEEP_2, A_LO, A_HI, SEATS[i].angle);
    hide(tl, [box(i), person(i)], t - 0.05, { duration: 0.3 });
    tl.to(seat(i), { attr: { fill: C.white }, duration: 0.25 }, t);
  });
  departures.forEach((t, k) => swap(tl, count, 2 - k, t + 0.1));

  hide(tl, RESIDENTS.map(box), 4.15, { duration: 0.35 });
  tl.to(q("[data-rec]"), { opacity: 0.15, duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: 7 }, 0.2);
  return seal(tl, DURATION);
}

function Detection({ s }) {
  const bx = s.x - 12;
  const by = s.y - 10;
  const tagW = 31;
  const tagX = s.left ? s.x + 12 - tagW : bx;
  const tagY = s.top ? by - 7.5 : by + 20.5;
  return (
    <g data-box={s.i} opacity="0">
      <rect x={bx} y={by} width="24" height="20" rx="1.5" stroke={C.ink} strokeWidth="1.25" />
      <rect x={tagX} y={tagY} width={tagW} height="7" rx="1" fill={C.ink} />
      <text x={tagX + tagW / 2} y={tagY + 5.1} fontFamily={MONO} fontSize="4.6" fill={C.white} textAnchor="middle">
        person {CONF[s.i]}
      </text>
    </g>
  );
}

export default forwardRef(function LibraryTracker(_, ref) {
  const clip = `room-${useId().replace(/:/g, "")}`;
  const coneLen = 320;
  const half = 12;
  const ray = (deg) => {
    const r = ((A_MID + deg) * Math.PI) / 180;
    return `${(CAM.x + Math.cos(r) * coneLen).toFixed(1)} ${(CAM.y + Math.sin(r) * coneLen).toFixed(1)}`;
  };

  return (
    <AnimStage
      ref={ref}
      viewBox="0 0 320 180"
      label="Top-down library floor plan: a camera sweeps the room, people are detected in seats with labelled bounding boxes, the occupancy counter rises to 7 of 12 and falls back as people leave."
      build={build}
    >
      <defs>
        <clipPath id={clip}>
          <rect x="12" y="12" width="236" height="156" rx="6" />
        </clipPath>
      </defs>
      <rect x="12" y="12" width="236" height="156" rx="6" fill={C.white} stroke={C.g2} strokeWidth="1.25" />
      <Label x={20} y={162} size={5.5} fill={C.g3} letterSpacing="1">
        READING ROOM · L2
      </Label>

      <g clipPath={`url(#${clip})`}>
        <path
          data-cone
          d={`M${CAM.x} ${CAM.y} L${ray(-half)} L${ray(half)} Z`}
          fill={C.ink}
          fillOpacity="0.045"
          stroke={C.g3}
          strokeDasharray="2 3"
          {...HAIR}
        />
      </g>

      {TABLES.map((c) => (
        <rect key={c} x={c - 25} y="78" width="50" height="24" rx="3" fill={C.white} stroke={C.ink} {...LINE} strokeWidth={1.5} />
      ))}
      {SEATS.map((s) => (
        <rect
          key={s.i}
          data-seat={s.i}
          x={s.x - 8}
          y={s.y - 6}
          width="16"
          height="12"
          rx="3"
          fill={RESIDENTS.includes(s.i) ? C.ink : C.white}
          stroke={C.g3}
          strokeWidth="1.25"
        />
      ))}
      {DETECTED.map((i) => (
        <circle
          key={i}
          data-person={i}
          cx={SEATS[i].x}
          cy={SEATS[i].y}
          r="4.5"
          fill={C.white}
          stroke={C.ink}
          strokeWidth="1.5"
          opacity={RESIDENTS.includes(i) ? 1 : 0}
        />
      ))}
      {DETECTED.map((i) => (
        <Detection key={i} s={SEATS[i]} />
      ))}

      {/* camera */}
      <g transform={`rotate(-35 ${CAM.x + 12} ${CAM.y - 4})`}>
        <rect x={CAM.x + 2} y={CAM.y - 10} width="22" height="12" rx="2.5" fill={C.ink} />
        <path d={`M${CAM.x + 2} ${CAM.y - 7} L${CAM.x - 4} ${CAM.y - 10} V${CAM.y + 2} L${CAM.x + 2} ${CAM.y - 1} Z`} fill={C.ink} />
      </g>
      <line x1={CAM.x + 20} y1={CAM.y - 20} x2={CAM.x + 28} y2={CAM.y - 26} stroke={C.ink} {...LINE} />
      <circle data-rec cx="266" cy="56" r="2" fill={C.ink} />
      <Label x={271} y={58} size={5.5} fill={C.g4}>
        CAM 01
      </Label>

      {/* counter */}
      <Label x={284} y={140} size={5.5} fill={C.g3} anchor="middle" letterSpacing="1">
        OCCUPIED
      </Label>
      {COUNTS.map((n, k) => (
        <text key={n} data-count x="284" y="156" fontFamily={MONO} fontSize="12" fontWeight="600" fill={C.ink} textAnchor="end" opacity={k ? 0 : 1}>
          {n}
        </text>
      ))}
      <text x="284" y="156" fontFamily={MONO} fontSize="12" fill={C.g3} textAnchor="start">
        /12
      </text>
    </AnimStage>
  );
});
