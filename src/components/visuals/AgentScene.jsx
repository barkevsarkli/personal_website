import Scene, { INK, LINE, MID, MONO } from "./Scene";

// BarkevGPT — an on-device agent: prompt → plan → call tools → observe → answer.
const CORE = [160, 64];
const TOOLS = [
  { y: 22, icon: ">_", name: "shell" },
  { y: 64, icon: "{}", name: "files" },
  { y: 106, icon: "∑", name: "calc" },
];
const PLAN = [58, 72, 86];

function hop(tl, el, [x1, y1], [x2, y2], at, d = 0.6) {
  tl.set(el, { attr: { cx: x1, cy: y1 }, opacity: 1 }, at)
    .to(el, { attr: { cx: x2, cy: y2 }, duration: d, ease: "power1.inOut" }, at)
    .set(el, { opacity: 0 }, at + d);
}

function build(tl, step) {
  tl.set(".u-bub, .ans", { opacity: 0, scale: 0.6, transformOrigin: "0% 100%" }, 0)
    .set(".u-line, .a-line", { scaleX: 0, transformOrigin: "0% 50%" }, 0)
    .set(".plan-row", { opacity: 0, x: -6 }, 0)
    .set(".plan-check", { strokeDashoffset: 1 }, 0)
    .set(".pkt", { opacity: 0 }, 0)
    .fromTo(".scene", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0)
    // The core's "thinking" ring turns for the whole loop (whole turns → seamless).
    .fromTo(".core-ring", { rotation: 0, svgOrigin: `${CORE[0]} ${CORE[1]}` }, { rotation: 720, duration: 13, ease: "none" }, 0);

  // 1 — prompt typed by the user, then sent to the core.
  step(0, 0.2);
  tl.to(".u-bub", { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" }, 0.3)
    .to(".u-line", { scaleX: 1, duration: 0.45, stagger: 0.4, ease: "none" }, 0.7);
  hop(tl, ".pkt", [118, 26], CORE, 1.7, 0.5);
  tl.to(".core", { scale: 1.08, svgOrigin: `${CORE[0]} ${CORE[1]}`, duration: 0.15, yoyo: true, repeat: 1 }, 2.2);

  // 2 — plan: a three-item checklist unfolds.
  step(1, 2.5);
  tl.to(".plan-row", { opacity: 1, x: 0, duration: 0.35, stagger: 0.3, ease: "power2.out" }, 2.6);

  // 3/4 — call a tool, observe the result, tick the plan item. Three rounds.
  [
    [0, 4.0],
    [2, 6.0],
    [1, 8.0],
  ].forEach(([t, at], i) => {
    const tool = `.tool-${t}`;
    const wire = `.wire-${t}`;
    const end = [246, TOOLS[t].y];
    step(2, at);
    tl.to(wire, { stroke: INK, duration: 0.2 }, at);
    hop(tl, ".pkt", CORE, end, at + 0.1, 0.5);
    tl.to(`${tool} rect`, { fill: INK, duration: 0.2 }, at + 0.6)
      .to(`${tool} text`, { fill: "#fff", duration: 0.2 }, at + 0.6);
    step(3, at + 1.0);
    hop(tl, ".pkt", end, CORE, at + 1.0, 0.5);
    tl.to(`${tool} rect`, { fill: "#fff", duration: 0.25 }, at + 1.2)
      .to(`${tool} text`, { fill: INK, duration: 0.25 }, at + 1.2)
      .to(wire, { stroke: LINE, duration: 0.3 }, at + 1.3)
      .to(`.plan-check-${i}`, { strokeDashoffset: 0, duration: 0.3 }, at + 1.5);
  });

  // 5 — the answer streams back.
  step(4, 9.9);
  hop(tl, ".pkt", CORE, [128, 106], 9.9, 0.5);
  tl.to(".ans", { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" }, 10.3)
    .to(".a-line", { scaleX: 1, duration: 0.5, stagger: 0.45, ease: "none" }, 10.6);

  tl.to(".scene", { opacity: 0, duration: 0.6 }, 12.4);
}

export default function AgentScene({ steps }) {
  return (
    <Scene steps={steps} build={build} still={0.85}>
      <g className="scene">
        {/* wires core → tools */}
        {TOOLS.map((t, i) => (
          <line key={i} className={`wire-${i}`} x1={CORE[0] + 22} y1={CORE[1]} x2="246" y2={t.y} stroke={LINE} strokeWidth="1.5" />
        ))}

        {/* user prompt */}
        <g className="u-bub">
          <rect x="10" y="10" width="108" height="32" rx="10" fill={INK} />
          <rect className="u-line" x="20" y="19" width="76" height="4" rx="2" fill="#fff" />
          <rect className="u-line" x="20" y="28" width="50" height="4" rx="2" fill="#fff" opacity="0.7" />
        </g>

        {/* plan */}
        {PLAN.map((y, i) => (
          <g key={i} className="plan-row">
            <rect x="12" y={y - 4} width="8" height="8" rx="1.5" fill="#fff" stroke={INK} strokeWidth="1.2" />
            <path
              className={`plan-check plan-check-${i}`}
              d={`M13.8 ${y} l2 2 l3 -4`}
              fill="none"
              stroke={INK}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="1"
              strokeDasharray="1"
            />
            <rect x="26" y={y - 2} width={[62, 78, 52][i]} height="4" rx="2" fill={LINE} />
          </g>
        ))}

        {/* agent core */}
        <g className="core">
          {[52, 64, 76].map((y) => (
            <g key={y} stroke={INK} strokeWidth="1.5">
              <line x1="133" y1={y} x2="138" y2={y} />
              <line x1="182" y1={y} x2="187" y2={y} />
            </g>
          ))}
          <rect x="138" y="42" width="44" height="44" rx="10" fill={INK} />
          <circle className="core-ring" cx={CORE[0]} cy={CORE[1]} r="12" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="5 4" />
          <circle cx={CORE[0]} cy={CORE[1]} r="3" fill="#fff" />
        </g>
        <text x="160" y="100" textAnchor="middle" fontFamily={MONO} fontSize="7" fill={MID}>
          on-device
        </text>

        {/* tools */}
        {TOOLS.map((t, i) => (
          <g key={i} className={`tool-${i}`}>
            <rect x="246" y={t.y - 12} width="64" height="24" rx="6" fill="#fff" stroke={INK} strokeWidth="1.5" />
            <text x="256" y={t.y + 3} fontFamily={MONO} fontSize="8" fontWeight="600" fill={INK}>
              {t.icon}
            </text>
            <text x="274" y={t.y + 3} fontFamily={MONO} fontSize="7" fill={INK}>
              {t.name}
            </text>
          </g>
        ))}

        {/* answer */}
        <g className="ans">
          <rect x="10" y="98" width="118" height="30" rx="10" fill="#fff" stroke={INK} strokeWidth="1.5" />
          <rect className="a-line" x="20" y="107" width="88" height="4" rx="2" fill={INK} />
          <rect className="a-line" x="20" y="116" width="60" height="4" rx="2" fill={INK} opacity="0.6" />
        </g>

        <circle className="pkt" r="3.5" fill={INK} stroke="#fff" strokeWidth="1.5" />
      </g>
    </Scene>
  );
}
