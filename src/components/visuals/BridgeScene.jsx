import Scene, { INK, LINE, MID, SOFT, MONO } from "./Scene";

// WhatsApp LLM — a chat message is queued by the C++ bridge, tokenized, run
// through the local model, and the reply streams back to the phone.
const SLOTS = [0, 1, 2].map((i) => 108 + i * 22);
const CELLS = [];
for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) CELLS.push([222 + c * 12, 42 + r * 12]);

function build(tl, step) {
  tl.set(".in-b", { opacity: 0, scale: 0.6, transformOrigin: "0% 100%" }, 0)
    .set(".out-b", { opacity: 0, scale: 0.6, transformOrigin: "100% 100%" }, 0)
    .set(".in-l, .out-l", { scaleX: 0, transformOrigin: "0% 50%" }, 0)
    .set(".ticks", { opacity: 0 }, 0)
    .set(".ticks path", { stroke: MID }, 0)
    .set(".env, .tok, .otok", { opacity: 0 }, 0)
    .set(".cell", { opacity: 0.15 }, 0)
    .fromTo(".scene", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);

  // 1 — a message arrives on WhatsApp and is handed to the bridge.
  step(0, 0.2);
  tl.to(".in-b", { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }, 0.3)
    .to(".in-l", { scaleX: 1, duration: 0.35, stagger: 0.3 }, 0.6)
    .to(".w1", { stroke: INK, duration: 0.2 }, 1.5)
    .set(".env", { x: 0, y: 0, opacity: 1 }, 1.5)
    .to(".env", { x: SLOTS[0] - 36, y: 26, duration: 0.8, ease: "power1.inOut" }, 1.5)
    .to(".w1", { stroke: LINE, duration: 0.3 }, 2.3);

  // 2 — it lands in the job queue (another chat is already waiting).
  step(1, 2.3);
  tl.set(".env", { opacity: 0 }, 2.3)
    .to(".slot-0", { fill: INK, duration: 0.2 }, 2.3)
    .to(".slot-1", { fill: MID, duration: 0.2 }, 2.8);

  // 3 — tokenize: the message splits into tokens that stream to the model.
  step(2, 3.4);
  tl.set(".tok", { x: SLOTS[0] + 3, y: 61, opacity: 1 }, 3.5)
    .to(".slot-0", { fill: "#fff", duration: 0.2 }, 3.5)
    .to(".tok", { x: (i) => 110 + i * 11, y: 78, duration: 0.5, stagger: 0.06, ease: "back.out(1.4)" }, 3.5)
    .to(".w2", { stroke: INK, duration: 0.2 }, 4.3)
    .to(".tok", { x: 214, y: 61, duration: 0.45, stagger: 0.12, ease: "power1.in" }, 4.4)
    .to(".tok", { opacity: 0, duration: 0.1, stagger: 0.12 }, 4.8)
    .to(".w2", { stroke: LINE, duration: 0.3 }, 5.4);

  // 4 — inference: compute waves sweep the model's grid.
  step(3, 5.4);
  ["start", "center", "end", "edges"].forEach((from, k) => {
    const at = 5.5 + k * 0.7;
    tl.to(".cell", { opacity: 1, duration: 0.18, stagger: { grid: [4, 4], from, amount: 0.35 } }, at)
      .to(".cell", { opacity: 0.15, duration: 0.25, stagger: { grid: [4, 4], from, amount: 0.35 } }, at + 0.25);
  });

  // 5 — reply tokens stream back and type out on the phone, then get read.
  step(4, 8.4);
  tl.to(".w1, .w2", { stroke: INK, duration: 0.2 }, 8.4)
    .set(".otok", { x: 214, y: 61, opacity: 1 }, 8.4)
    .to(".otok", { x: 64, duration: 0.9, stagger: 0.18, ease: "power1.inOut" }, 8.4)
    .to(".otok", { opacity: 0, duration: 0.1, stagger: 0.18 }, 9.25)
    .to(".out-b", { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }, 9.0)
    .to(".out-l", { scaleX: 1, duration: 0.35, stagger: 0.28 }, 9.3)
    .to(".w1, .w2", { stroke: LINE, duration: 0.3 }, 10.3)
    .to(".slot-1", { fill: "#fff", duration: 0.2 }, 10.3)
    .to(".ticks", { opacity: 1, duration: 0.2 }, 10.5)
    .to(".ticks path", { stroke: INK, duration: 0.3 }, 11.2);

  tl.to(".scene", { opacity: 0, duration: 0.6 }, 12.4);
}

export default function BridgeScene({ steps }) {
  return (
    <Scene steps={steps} build={build} still={0.8}>
      <g className="scene">
        {/* wires */}
        <line className="w1" x1="72" y1="64" x2="102" y2="64" stroke={LINE} strokeWidth="1.5" />
        <line className="w2" x1="176" y1="64" x2="214" y2="64" stroke={LINE} strokeWidth="1.5" />

        {/* phone */}
        <rect x="10" y="8" width="62" height="112" rx="10" fill="#fff" stroke={INK} strokeWidth="2" />
        <rect x="33" y="12" width="16" height="3" rx="1.5" fill={INK} />
        <line x1="14" y1="22" x2="68" y2="22" stroke={SOFT} />
        <g className="in-b">
          <rect x="16" y="30" width="40" height="16" rx="6" fill={SOFT} />
          <rect className="in-l" x="21" y="35" width="28" height="2.5" rx="1" fill={MID} />
          <rect className="in-l" x="21" y="40" width="18" height="2.5" rx="1" fill={MID} />
        </g>
        <g className="out-b">
          <rect x="26" y="54" width="40" height="22" rx="6" fill={INK} />
          <rect className="out-l" x="31" y="59" width="30" height="2.5" rx="1" fill="#fff" />
          <rect className="out-l" x="31" y="64" width="24" height="2.5" rx="1" fill="#fff" />
          <rect className="out-l" x="31" y="69" width="14" height="2.5" rx="1" fill="#fff" />
        </g>
        <g className="ticks" fill="none" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M53 82 l1.8 1.8 l3.2 -3.6" />
          <path d="M57 82 l1.8 1.8 l3.2 -3.6" />
        </g>

        {/* C++ bridge with its job queue */}
        <rect x="102" y="38" width="74" height="52" rx="6" fill="#fff" stroke={INK} strokeWidth="1.5" />
        <text x="108" y="49" fontFamily={MONO} fontSize="6.5" fill={INK}>
          bridge.cpp
        </text>
        {SLOTS.map((x, i) => (
          <rect key={i} className={`slot-${i}`} x={x} y="56" width="18" height="12" rx="2" fill="#fff" stroke={LINE} strokeWidth="1.2" />
        ))}

        {/* local model chip */}
        <g stroke={INK} strokeWidth="1.5" strokeLinecap="round">
          {[46, 58, 70, 82].map((v) => (
            <g key={v}>
              <line x1="209" y1={v} x2="214" y2={v} />
              <line x1="274" y1={v} x2="279" y2={v} />
              <line x1={v + 180} y1="29" x2={v + 180} y2="34" />
              <line x1={v + 180} y1="94" x2={v + 180} y2="99" />
            </g>
          ))}
        </g>
        <rect x="214" y="34" width="60" height="60" rx="6" fill={INK} />
        {CELLS.map(([x, y], i) => (
          <rect key={i} className="cell" x={x} y={y} width="9" height="9" rx="1.5" fill="#fff" />
        ))}
        <text x="244" y="112" textAnchor="middle" fontFamily={MONO} fontSize="7" fill={MID}>
          local LLM
        </text>

        {/* moving parts */}
        <rect className="env" x="36" y="35" width="12" height="8" rx="1.5" fill={INK} stroke="#fff" strokeWidth="1" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} className="tok" width="7" height="7" rx="1.5" fill={INK} stroke="#fff" strokeWidth="1" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} className="otok" width="7" height="7" rx="1.5" fill="#fff" stroke={INK} strokeWidth="1.2" />
        ))}
      </g>
    </Scene>
  );
}
