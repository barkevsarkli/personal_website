import Scene, { INK, LINE, MID, SOFT, MONO } from "./Scene";

// Blood Donor System — a 3NF schema: tables appear, foreign keys link them,
// a donation is inserted, the keys join, and a SQL view is assembled.
const W = 90;
const TABLES = [
  { key: "donor", name: "DONOR", x: 8, cols: [["id", "PK"], ["name"], ["blood_type"]] },
  { key: "dn", name: "DONATION", x: 115, cols: [["id", "PK"], ["donor_id", "FK"], ["recipient_id", "FK"], ["date"]] },
  { key: "rc", name: "RECIPIENT", x: 222, cols: [["id", "PK"], ["name"], ["blood_type"]] },
];
const rowY = (r) => 21 + r * 10;
const LINKS = ["M98 26 H106 V36 H115", "M205 46 H213 V26 H222"];
const JOIN = [".r-donor-0", ".r-dn-1", ".r-dn-2", ".r-rc-0"];
const VIEW = { x: 70, y: 84, cols: ["donor", "blood", "recipient", "date"] };
// Cells copied into the view: [source x, source y] → view column.
const PICKS = [
  [53, 36],
  [53, 46],
  [267, 36],
  [160, 56],
];

function build(tl, step, el) {
  const rows = el.querySelector(".rowcount");
  const n = { v: 1204 };
  const show = () => (rows.textContent = `${Math.round(n.v).toLocaleString("en-US")} rows`);

  tl.set(n, { v: 1204, onComplete: show }, 0)
    .set(".tbl", { opacity: 0, y: 6 }, 0)
    .set(".link, .flow", { strokeDashoffset: 1 }, 0)
    .set(".flow", { opacity: 0 }, 0)
    .set(".crow, .card, .nf, .rowcount", { opacity: 0 }, 0)
    .set(".rec", { opacity: 0, x: 0, y: 0, scale: 1, transformOrigin: "50% 50%" }, 0)
    .set(".view", { opacity: 0, y: 6 }, 0)
    .set(".vcol", { opacity: 0 }, 0)
    .set(".vrow", { scaleX: 0, transformOrigin: "0% 50%" }, 0)
    .set(".pick", { opacity: 0 }, 0)
    .fromTo(".scene", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);

  // 1 — schema: three normalized tables.
  step(0, 0.2);
  tl.to(".tbl", { opacity: 1, y: 0, duration: 0.5, stagger: 0.3, ease: "power2.out" }, 0.3)
    .to(".rowcount", { opacity: 1, duration: 0.3 }, 1.4);

  // 2 — relations: foreign keys link DONATION to both sides.
  step(1, 2.0);
  tl.to(".link", { strokeDashoffset: 0, duration: 0.6, stagger: 0.4, ease: "power2.inOut" }, 2.1)
    .to(".crow, .card", { opacity: 1, duration: 0.3 }, 3.0)
    .to(".nf", { opacity: 1, duration: 0.3 }, 3.3);

  // 3 — insert a donation record.
  step(2, 4.0);
  tl.to(".rec", { opacity: 1, duration: 0.3 }, 4.1)
    .to(".rec", { y: -48, scale: 0.5, duration: 0.7, ease: "power2.in" }, 4.6)
    .to(".rec", { opacity: 0, duration: 0.15 }, 5.2)
    .to(".tbl-dn .frame", { stroke: MID, strokeWidth: 3, duration: 0.15, yoyo: true, repeat: 1 }, 5.25)
    .to(n, { v: 1205, duration: 0.2, onUpdate: show }, 5.3);

  // 4 — join on the keys.
  step(3, 6.1);
  tl.to(JOIN.map((s) => `${s} rect`), { fill: INK, duration: 0.25, stagger: 0.15 }, 6.2)
    .to(JOIN.map((s) => `${s} text`), { fill: "#fff", duration: 0.25, stagger: 0.15 }, 6.2)
    .to(".link", { stroke: INK, duration: 0.3 }, 6.4);
  [0, 1].forEach((k) =>
    tl.set(".flow", { strokeDashoffset: 0.2, opacity: 1 }, 6.8 + k * 0.7)
      .to(".flow", { strokeDashoffset: -1, duration: 0.7, ease: "none" }, 6.8 + k * 0.7)
  );
  tl.set(".flow", { opacity: 0 }, 8.2);

  // 5 — assemble the view from the joined columns.
  step(4, 8.4);
  tl.to(".view", { opacity: 1, y: 0, duration: 0.4 }, 8.4);
  PICKS.forEach(([x, y], i) => {
    const at = 8.7 + i * 0.25;
    tl.set(`.pick-${i}`, { x: x - 10, y: y - 3.5, opacity: 1 }, at)
      .to(`.pick-${i}`, { x: VIEW.x + i * 45 + 12, y: VIEW.y + 13, duration: 0.5, ease: "power2.inOut" }, at)
      .set(`.pick-${i}`, { opacity: 0 }, at + 0.5)
      .to(`.vcol-${i}`, { opacity: 1, duration: 0.2 }, at + 0.45);
  });
  tl.to(".vrow", { scaleX: 1, duration: 0.35, stagger: 0.12 }, 9.9)
    .to(JOIN.map((s) => `${s} rect`), { fill: "#fff", duration: 0.4 }, 10.6)
    .to(JOIN.map((s) => `${s} text`), { fill: INK, duration: 0.4 }, 10.6)
    .to(".link", { stroke: MID, duration: 0.4 }, 10.6);

  tl.to(".scene", { opacity: 0, duration: 0.6 }, 12.4);
}

export default function DatabaseScene({ steps }) {
  return (
    <Scene steps={steps} build={build} still={0.9}>
      <g className="scene" fontFamily={MONO}>
        {/* foreign-key links */}
        {LINKS.map((d, i) => (
          <path key={i} className="link" d={d} fill="none" stroke={MID} strokeWidth="1.2" pathLength="1" strokeDasharray="1" />
        ))}
        {LINKS.map((d, i) => (
          <path key={i} className="flow" d={d} fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" pathLength="1" strokeDasharray="0.2 1.2" />
        ))}
        <g className="crow" stroke={MID} strokeWidth="1.1">
          <path d="M111 36 L115 33 M111 36 L115 39" />
          <path d="M209 46 L205 43 M209 46 L205 49" />
        </g>
        <g className="card" fontSize="5.5" fill={MID}>
          <text x="100" y="23">1</text>
          <text x="108" y="33">N</text>
          <text x="215" y="23">1</text>
          <text x="207" y="43">N</text>
        </g>

        {/* tables */}
        {TABLES.map((t) => (
          <g key={t.key} className={`tbl tbl-${t.key}`}>
            <rect className="frame" x={t.x} y="8" width={W} height={13 + t.cols.length * 10} rx="3" fill="#fff" stroke={INK} strokeWidth="1.4" />
            <rect x={t.x} y="8" width={W} height="13" rx="3" fill={INK} />
            <text x={t.x + 6} y="17" fontSize="6.5" fontWeight="600" letterSpacing="0.5" fill="#fff">
              {t.name}
            </text>
            {t.cols.map(([c, k], r) => (
              <g key={c} className={`r-${t.key}-${r}`}>
                <rect x={t.x + 1.5} y={rowY(r) + 0.5} width={W - 3} height="9" rx="1.5" fill="#fff" />
                <text x={t.x + 6} y={rowY(r) + 7} fontSize="6" fill={INK}>
                  {c}
                </text>
                {k && (
                  <text x={t.x + W - 6} y={rowY(r) + 7} fontSize="5.5" textAnchor="end" fill={MID}>
                    {k}
                  </text>
                )}
              </g>
            ))}
          </g>
        ))}
        <g className="nf">
          <rect x="8" y="58" width="34" height="11" rx="5.5" fill="#fff" stroke={INK} strokeWidth="1.2" />
          <text x="25" y="65.8" fontSize="6" textAnchor="middle" fill={INK}>
            3NF ✓
          </text>
        </g>
        <text className="rowcount" x="160" y="74" fontSize="6" textAnchor="middle" fill={MID}>
          1,204 rows
        </text>

        {/* new donation record */}
        <g className="rec">
          <rect x="128" y="100" width="64" height="20" rx="3" fill="#fff" stroke={INK} strokeWidth="1.3" />
          <rect x="128" y="92" width="30" height="9" rx="2" fill={INK} />
          <text x="143" y="98.5" fontSize="5" textAnchor="middle" fill="#fff">
            INSERT
          </text>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={133 + i * 14} y="107" width="11" height="4" rx="1" fill={i === 0 ? INK : LINE} />
          ))}
        </g>

        {/* the view */}
        <g className="view">
          <rect x={VIEW.x} y={VIEW.y} width="180" height="48" rx="3" fill="#fff" stroke={INK} strokeWidth="1.4" />
          <rect x={VIEW.x} y={VIEW.y} width="180" height="11" rx="3" fill={INK} />
          <text x={VIEW.x + 6} y={VIEW.y + 8} fontSize="6" fontWeight="600" fill="#fff">
            VIEW v_donation_log
          </text>
          <line x1={VIEW.x} y1={VIEW.y + 21} x2={VIEW.x + 180} y2={VIEW.y + 21} stroke={SOFT} />
          {VIEW.cols.map((c, i) => (
            <text key={c} className={`vcol vcol-${i}`} x={VIEW.x + 6 + i * 45} y={VIEW.y + 18} fontSize="5.8" fill={INK}>
              {c}
            </text>
          ))}
          {[0, 1, 2].map((r) =>
            VIEW.cols.map((_, i) => (
              <rect
                key={`${r}-${i}`}
                className="vrow"
                x={VIEW.x + 6 + i * 45}
                y={VIEW.y + 25 + r * 7.5}
                width={[30, 14, 34, 26][i] - r * 3}
                height="3.2"
                rx="1"
                fill={r === 0 ? INK : LINE}
              />
            ))
          )}
        </g>
        {PICKS.map((_, i) => (
          <rect key={i} className={`pick pick-${i}`} width="20" height="7" rx="1.5" fill={INK} stroke="#fff" strokeWidth="0.8" />
        ))}
      </g>
    </Scene>
  );
}
