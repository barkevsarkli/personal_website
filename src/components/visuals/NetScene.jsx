import Scene, { INK, LINE, MID, SOFT, MONO } from "./Scene";

// Neural Network (C++) — two training epochs: activations flow forward, the
// loss is measured, gradients flow backward, weights (edge widths) update, and
// the loss curve on the right drops.
const LAYERS = [3, 4, 4, 2].map((n, l) =>
  Array.from({ length: n }, (_, i) => [24 + l * 54, 64 + (i - (n - 1) / 2) * 26])
);
const EDGES = [];
for (let l = 0; l < LAYERS.length - 1; l++)
  LAYERS[l].forEach((a, i) =>
    LAYERS[l + 1].forEach((b, j) => EDGES.push({ l, a, b, w: 0.6 + (((i * 7 + j * 3 + l * 5) % 7) / 6) * 1.6 }))
  );

// Loss curve (plot area x 218–310, y 22–100), revealed per epoch.
const CURVE = Array.from({ length: 24 }, (_, i) => {
  const t = i / 23;
  const y = 26 + 70 * (1 - Math.exp(-4 * t)) + Math.sin(i * 2.3) * 2.2 * (1 - t);
  return `${218 + t * 92},${y.toFixed(1)}`;
}).join(" ");

function build(tl, step, el) {
  const lossEl = el.querySelector(".loss");
  const epochEl = el.querySelector(".epoch");
  const s = { loss: 0.93, epoch: 1 };
  const show = () => {
    lossEl.textContent = `L = ${s.loss.toFixed(2)}`;
    epochEl.textContent = `epoch ${String(Math.round(s.epoch)).padStart(2, "0")}`;
  };

  tl.set(s, { loss: 0.93, epoch: 1, onComplete: show }, 0)
    .set(".act", { scale: 0, transformOrigin: "50% 50%" }, 0)
    .set(".flow", { strokeDashoffset: 0.3, opacity: 0 }, 0)
    .set(".curve", { strokeDashoffset: 1 }, 0)
    .set(".loss-badge", { opacity: 0, y: 4 }, 0)
    .fromTo(".scene", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);

  const forward = (at, per) => {
    tl.to(".act-0", { scale: 1, duration: 0.3, stagger: 0.06 }, at);
    for (let l = 0; l < 3; l++) {
      const t = at + 0.25 + l * per;
      tl.set(`.flow-${l}`, { strokeDashoffset: 0.3, opacity: 1, stroke: INK }, t)
        .to(`.flow-${l}`, { strokeDashoffset: -1, duration: per, ease: "none" }, t)
        .set(`.flow-${l}`, { opacity: 0 }, t + per)
        .to(`.act-${l + 1}`, { scale: 1, duration: 0.25, stagger: 0.05 }, t + per * 0.8);
    }
  };
  const backward = (at, per) => {
    for (let l = 2; l >= 0; l--) {
      const t = at + (2 - l) * per;
      tl.set(`.flow-${l}`, { strokeDashoffset: -1, opacity: 1, stroke: MID }, t)
        .to(`.flow-${l}`, { strokeDashoffset: 0.3, duration: per, ease: "none" }, t)
        .set(`.flow-${l}`, { opacity: 0 }, t + per);
    }
  };
  const loss = (at, value) => {
    tl.to(".act-3", { scale: 1.35, duration: 0.18, yoyo: true, repeat: 3 }, at)
      .to(".loss-badge", { opacity: 1, y: 0, duration: 0.3 }, at)
      .to(s, { loss: value, duration: 0.5, onUpdate: show }, at + 0.1);
  };
  const update = (at, curveTo, seed) => {
    tl.to(".edge", { strokeWidth: (i) => 0.5 + (((i * seed) % 11) / 10) * 2, duration: 0.6, ease: "power2.inOut" }, at)
      .to(".act", { scale: 0, duration: 0.4 }, at + 0.3)
      .to(".curve", { strokeDashoffset: curveTo, duration: 0.8, ease: "power1.out" }, at);
  };

  // Epoch 1, told slowly.
  step(0, 0.2);
  tl.to(".act-0", { scale: 1, duration: 0.3, stagger: 0.12 }, 0.4);
  step(1, 1.3);
  forward(1.3, 0.75);
  step(2, 3.8);
  loss(3.8, 0.41);
  step(3, 4.8);
  backward(4.8, 0.7);
  step(4, 7.0);
  update(7.0, 0.52, 5);
  tl.to(".loss-badge", { opacity: 0, duration: 0.3 }, 7.6);

  // Epoch 2, faster — training in rhythm.
  tl.to(s, { epoch: 2, duration: 0.01, onUpdate: show }, 8.0);
  step(1, 8.0);
  forward(8.0, 0.45);
  step(2, 9.6);
  loss(9.6, 0.12);
  step(3, 10.3);
  backward(10.3, 0.4);
  step(4, 11.5);
  update(11.5, 0, 7);

  tl.to(".scene", { opacity: 0, duration: 0.6 }, 12.6);
}

export default function NetScene({ steps }) {
  return (
    <Scene steps={steps} build={build} still={0.9}>
      <g className="scene">
        {EDGES.map((e, i) => (
          <line key={i} className="edge" x1={e.a[0]} y1={e.a[1]} x2={e.b[0]} y2={e.b[1]} stroke={LINE} strokeWidth={e.w} />
        ))}
        {EDGES.map((e, i) => (
          <line
            key={i}
            className={`flow flow-${e.l}`}
            x1={e.a[0]}
            y1={e.a[1]}
            x2={e.b[0]}
            y2={e.b[1]}
            stroke={INK}
            strokeWidth="1.8"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="0.3 1.3"
          />
        ))}
        {LAYERS.map((layer, l) =>
          layer.map(([x, y], i) => (
            <g key={`${l}-${i}`}>
              <circle cx={x} cy={y} r="6.5" fill="#fff" stroke={INK} strokeWidth="1.5" />
              <circle className={`act act-${l}`} cx={x} cy={y} r="4" fill={INK} />
            </g>
          ))
        )}
        <g className="loss-badge">
          <rect x="164" y="112" width="46" height="13" rx="3" fill={INK} />
          <text className="loss" x="187" y="121" textAnchor="middle" fontFamily={MONO} fontSize="6.5" fill="#fff">
            L = 0.93
          </text>
        </g>

        {/* loss plot */}
        <text x="218" y="16" fontFamily={MONO} fontSize="6" letterSpacing="1" fill={MID}>
          LOSS
        </text>
        <path d="M216 20 V102 H312" fill="none" stroke={LINE} strokeWidth="1" />
        {[42, 62, 82].map((y) => (
          <line key={y} x1="217" y1={y} x2="312" y2={y} stroke={SOFT} strokeWidth="0.8" />
        ))}
        <polyline
          className="curve"
          points={CURVE}
          fill="none"
          stroke={INK}
          strokeWidth="1.6"
          strokeLinejoin="round"
          pathLength="1"
          strokeDasharray="1"
        />
        <text className="epoch" x="218" y="116" fontFamily={MONO} fontSize="7" fill={INK}>
          epoch 01
        </text>
      </g>
    </Scene>
  );
}
