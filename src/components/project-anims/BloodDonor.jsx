import { forwardRef } from "react";
import AnimStage from "./AnimStage";
import { Label, Typed } from "./parts";
import { C, DRAW, EASE, LINE, MONO, createTimeline, drawLine, eraseText, hide, pop, pulse, seal, show, typeText } from "./utils";

const DURATION = 4;
const QUERY = "SELECT * FROM Donations JOIN Donors d JOIN Recipients r";
const TOP = 32;
const ROW_H = 11;
const rowTop = (r) => TOP + 25 + r * ROW_H;

const TABLES = [
  { name: "Donors", x: 10, cols: [["PK id", 6], ["type", 50]], rows: [["D1", "A+"], ["D2", "O-"], ["D3", "B+"]], match: 1 },
  {
    name: "Donations",
    x: 116,
    cols: [["PK id", 6], ["FK don", 32], ["FK rec", 60]],
    rows: [["X1", "D3", "R2"], ["X2", "D2", "R1"], ["X3", "D1", "R3"]],
    match: 1,
  },
  { name: "Recipients", x: 222, cols: [["PK id", 6], ["type", 50]], rows: [["R1", "O-"], ["R2", "AB+"], ["R3", "A+"]], match: 0 },
];
const W = 88;
const BOTTOM = rowTop(3) + 2;

// FK relationship routes (Donations.don -> Donors.id, Donations.rec -> Recipients.id).
const FK = [
  { from: 116 + 32 + 10, to: 10 + 10, depth: 104 },
  { from: 116 + 60 + 10, to: 222 + 10, depth: 104 },
];

function Row({ t, r, cells, fill, name }) {
  return (
    <g data-row={name}>
      {cells.map((v, c) => (
        <text key={c} x={t.x + t.cols[c][1]} y={rowTop(r) + 8} fontFamily={MONO} fontSize="6" fill={fill}>
          {v}
        </text>
      ))}
    </g>
  );
}

function build(q) {
  const tl = createTimeline();
  const query = q("[data-typed='sql'] tspan");
  const caret = q("[data-caret]");
  const fk = q("[data-fk]");
  const feet = q("[data-foot]");
  const view = q("[data-result]");
  const drop = q("[data-drop]");

  hide(tl, caret, 0.1, { duration: 0.05 });
  typeText(tl, query, 0.12, { each: 0.016 });

  drawLine(tl, fk, 1.05, { duration: 0.4, stagger: 0.1 });
  show(tl, feet, 1.4, { duration: 0.15 });

  // Matching rows light up across all three tables.
  TABLES.forEach((t, i) => {
    const at = 1.55 + i * 0.2;
    show(tl, q(`[data-hl="${i}"]`), at, { duration: 0.18 });
  });

  // The joined row lands in the VIEW, and the drop pulses once.
  tl.fromTo(view, { opacity: 0, y: -22 }, { opacity: 1, y: 0, duration: 0.45, ease: EASE.snap, immediateRender: false }, 2.25);
  tl.to(drop, { attr: { "fill-opacity": 1 }, duration: 0.15 }, 2.7);
  pulse(tl, drop, 2.7, { scale: 1.35, duration: 0.4, origin: "50% 100%" });

  // Clear.
  eraseText(tl, query, 3.3, { duration: 0.3 });
  hide(tl, [...fk, ...feet, ...q("[data-hl]"), ...view], 3.3, { duration: 0.3 });
  tl.to(drop, { attr: { "fill-opacity": 0 }, duration: 0.3 }, 3.3);
  show(tl, caret, 3.75, { duration: 0.1 });
  return seal(tl, DURATION);
}

export default forwardRef(function BloodDonor(_, ref) {
  return (
    <AnimStage
      ref={ref}
      viewBox="0 0 320 180"
      label="Three normalised tables, Donors, Donations and Recipients: a SQL join is typed, foreign-key lines draw between them, an O-negative donor is matched to a compatible recipient and the joined row slides into a view."
      build={build}
    >
      <Label x={10} y={20} size={6.5} fill={C.g3}>
        ›
      </Label>
      <rect data-caret x="17" y="14.5" width="3.5" height="7" fill={C.ink} />
      <Typed name="sql" text={QUERY} x={17} y={20} size={6} />

      {TABLES.map((t, i) => (
        <g key={t.name}>
          <rect x={t.x} y={TOP} width={W} height={BOTTOM - TOP} rx="3" fill={C.white} stroke={C.ink} {...LINE} strokeWidth={1.5} />
          <path d={`M${t.x} ${TOP + 13} V${TOP + 3} a3 3 0 0 1 3 -3 H${t.x + W - 3} a3 3 0 0 1 3 3 V${TOP + 13} Z`} fill={C.ink} />
          <text x={t.x + 6} y={TOP + 9.3} fontFamily={MONO} fontSize="7" fontWeight="600" fill={C.white}>
            {t.name}
          </text>
          {t.cols.map(([label, dx]) => (
            <text key={label} x={t.x + dx} y={TOP + 21} fontFamily={MONO} fontSize="5" fill={C.g3}>
              {label}
            </text>
          ))}
          <line x1={t.x} y1={TOP + 24} x2={t.x + W} y2={TOP + 24} stroke={C.g1} strokeWidth="1" />
          {t.rows.map((cells, r) => (
            <Row key={r} t={t} r={r} cells={cells} fill={C.ink} />
          ))}
          <g data-hl={i} opacity="0">
            <rect x={t.x + 2} y={rowTop(t.match)} width={W - 4} height={ROW_H} rx="1.5" fill={C.ink} />
            <Row t={t} r={t.match} cells={t.rows[t.match]} fill={C.white} />
          </g>
        </g>
      ))}

      {FK.map((f) => (
        <g key={f.from}>
          <path data-fk d={`M${f.from} ${BOTTOM} V${f.depth} H${f.to} V${BOTTOM}`} stroke={C.ink} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" {...DRAW} opacity="0" />
          <path data-foot d={`M${f.from - 4} ${BOTTOM} L${f.from} ${BOTTOM + 5} L${f.from + 4} ${BOTTOM} M${f.to - 4} ${BOTTOM + 4} H${f.to + 4}`} stroke={C.ink} strokeWidth="1.25" strokeLinecap="round" opacity="0" />
        </g>
      ))}

      {/* VIEW */}
      <rect x="70" y="120" width="180" height="46" rx="4" stroke={C.ink} strokeWidth="1.5" strokeDasharray="3 3" fill={C.white} />
      <Label x={78} y={131} size={6} fill={C.g4}>
        VIEW donor_match
      </Label>
      <g data-result opacity="0">
        <rect x="76" y="138" width="168" height="18" rx="2" fill={C.ink} />
        <text x="160" y="149.5" fontFamily={MONO} fontSize="6.5" fontWeight="500" fill={C.white} textAnchor="middle" xmlSpace="preserve">
          D2 O-  →  X2  →  R1 O-  ✓
        </text>
      </g>

      <path
        data-drop
        d="M276 134 C276 134 268 144 268 149 a8 8 0 0 0 16 0 C284 144 276 134 276 134 Z"
        fill={C.ink}
        fillOpacity="0"
        stroke={C.ink}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </AnimStage>
  );
});
