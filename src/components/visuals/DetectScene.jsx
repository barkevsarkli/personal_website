import Scene, { INK, LINE, MID, SOFT, MONO } from "./Scene";

// Library Tracker — top-down camera over two study tables. YOLO scans the
// frame, boxes the occupied seats, counts them, then keeps the count live as
// people come and go.
const SEATS = [];
[52, 84, 116, 148].forEach((x) => SEATS.push([x + 8, 30]));
[52, 84, 116, 148].forEach((x) => SEATS.push([x + 8, 100]));
const CONF = ["0.94", "0.91", "0.88", "0.97", "0.93", "0.90", "0.89", "0.95"];
const START = [0, 2, 5, 6]; // seated from the start
const LEAVES = 2;
const ARRIVE = [7, 3];
const HIST = [2, 3, 5, 4, 6, 5, 4]; // earlier readings (of 8)

function build(tl, step, el) {
  const count = el.querySelector(".count");
  const n = { v: 0 };
  const show = () => (count.textContent = `${Math.round(n.v)}/8`);
  const setCount = (v, at, d = 0.5) => tl.to(n, { v, duration: d, ease: "none", onUpdate: show }, at);

  tl.set(n, { v: 0, onComplete: show }, 0)
    .set(START.map((i) => `.person-${i}`), { opacity: 1, y: 0 }, 0)
    .set(ARRIVE.map((i) => `.person-${i}`), { opacity: 0, transformOrigin: "50% 50%" }, 0)
    .set(".box", { strokeDashoffset: 1, opacity: 1 }, 0)
    .set(".tag", { opacity: 0, y: 3 }, 0)
    .set(".scan", { y: 0, opacity: 0 }, 0)
    .set(".occ", { scaleX: 0, transformOrigin: "0% 50%" }, 0)
    .set(".hist", { scaleY: 0, transformOrigin: "50% 100%" }, 0)
    .set(".hist-now", { scaleY: 0, transformOrigin: "50% 100%" }, 0)
    .fromTo(".scene", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0)
    .to(".rec", { opacity: 0.2, duration: 0.5, repeat: 25, yoyo: true, ease: "steps(1)" }, 0);

  // 1 — the raw camera feed.
  step(0, 0.2);
  tl.to(".hist", { scaleY: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" }, 0.6);

  // 2 — scan line sweeps the frame.
  step(1, 1.7);
  tl.to(".scan", { opacity: 0.55, duration: 0.2 }, 1.8)
    .to(".scan", { y: 110, duration: 1.6, ease: "power1.inOut" }, 1.8)
    .to(".scan", { opacity: 0, duration: 0.2 }, 3.3);

  // 3 — bounding boxes draw around each occupied seat.
  step(2, 3.6);
  START.forEach((i, k) => {
    tl.to(`.box-${i}`, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, 3.7 + k * 0.3)
      .to(`.tag-${i}`, { opacity: 1, y: 0, duration: 0.25 }, 3.95 + k * 0.3);
  });

  // 4 — count them.
  step(3, 5.4);
  setCount(4, 5.5, 0.8);
  tl.to(".occ", { scaleX: 0.5, duration: 0.8, ease: "power2.out" }, 5.5)
    .to(".hist-now", { scaleY: 0.5, duration: 0.5, ease: "power2.out" }, 5.8);

  // 5 — live updates: someone leaves, two people arrive.
  step(4, 7.2);
  tl.to(`.box-${LEAVES}`, { opacity: 0, duration: 0.3 }, 7.3)
    .to(`.tag-${LEAVES}`, { opacity: 0, duration: 0.3 }, 7.3)
    .to(`.person-${LEAVES}`, { opacity: 0, y: -10, duration: 0.6, ease: "power1.in" }, 7.5);
  setCount(3, 7.9, 0.3);
  tl.to(".occ", { scaleX: 3 / 8, duration: 0.3 }, 7.9)
    .to(".hist-now", { scaleY: 3 / 8, duration: 0.3 }, 7.9);
  ARRIVE.forEach((i, k) => {
    const at = 8.8 + k * 1.3;
    tl.fromTo(`.person-${i}`, { opacity: 0, scale: 0.4, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, immediateRender: false }, at)
      .to(`.box-${i}`, { strokeDashoffset: 0, duration: 0.4 }, at + 0.5)
      .to(`.tag-${i}`, { opacity: 1, y: 0, duration: 0.25 }, at + 0.75);
    setCount(4 + k, at + 0.7, 0.3);
    tl.to(".occ", { scaleX: (4 + k) / 8, duration: 0.3 }, at + 0.7)
      .to(".hist-now", { scaleY: (4 + k) / 8, duration: 0.3 }, at + 0.7);
  });

  tl.to(".scene", { opacity: 0, duration: 0.6 }, 12.4);
}

function Person({ i, x, y }) {
  return (
    <g className={`person person-${i}`}>
      <ellipse cx={x} cy={y} rx="8" ry="5" fill={MID} />
      <circle cx={x} cy={y} r="3.8" fill={INK} />
    </g>
  );
}

export default function DetectScene({ steps }) {
  return (
    <Scene steps={steps} build={build} still={0.95}>
      <g className="scene">
        {/* camera frame */}
        <g fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round">
          <path d="M8 18 V8 H18" />
          <path d="M198 8 H208 V18" />
          <path d="M8 116 V126 H18" />
          <path d="M198 126 H208 V116" />
        </g>
        <circle className="rec" cx="18" cy="17" r="2.2" fill={INK} />
        <text x="24" y="19.3" fontFamily={MONO} fontSize="6" fill={MID}>
          CAM 02
        </text>

        {/* tables + chairs */}
        <rect x="44" y="42" width="128" height="14" rx="3" fill={SOFT} />
        <rect x="44" y="78" width="128" height="14" rx="3" fill={SOFT} />
        {SEATS.map(([x, y], i) => (
          <rect key={i} x={x - 8} y={y - 5} width="16" height="10" rx="3" fill="none" stroke={LINE} strokeWidth="1.2" />
        ))}
        {SEATS.map(([x, y], i) => (
          <Person key={i} i={i} x={x} y={y} />
        ))}

        {/* detections */}
        {SEATS.map(([x, y], i) => {
          const top = i < 4;
          const ty = top ? y - 17 : y + 11;
          return (
            <g key={i}>
              <path
                className={`box box-${i}`}
                d={`M${x - 11} ${y - 9} h22 v18 h-22 Z`}
                fill="none"
                stroke={INK}
                strokeWidth="1.2"
                pathLength="1"
                strokeDasharray="1"
              />
              <g className={`tag tag-${i}`}>
                <rect x={x - 11} y={ty} width="17" height="6.5" rx="1" fill={INK} />
                <text x={x - 9.5} y={ty + 4.9} fontFamily={MONO} fontSize="4.6" fill="#fff">
                  {CONF[i]}
                </text>
              </g>
            </g>
          );
        })}
        <rect className="scan" x="10" y="10" width="196" height="2" rx="1" fill={INK} />

        {/* occupancy panel */}
        <text x="222" y="20" fontFamily={MONO} fontSize="6" letterSpacing="1" fill={MID}>
          OCCUPANCY
        </text>
        <text className="count" x="222" y="44" fontFamily={MONO} fontSize="20" fontWeight="600" fill={INK}>
          0/8
        </text>
        <rect x="222" y="52" width="88" height="5" rx="2.5" fill={SOFT} />
        <rect className="occ" x="222" y="52" width="88" height="5" rx="2.5" fill={INK} />
        <text x="222" y="70" fontFamily={MONO} fontSize="5.5" fill={MID}>
          yolo · 30 fps
        </text>
        <line x1="222" y1="120.5" x2="310" y2="120.5" stroke={LINE} />
        {HIST.map((h, i) => (
          <rect key={i} className="hist" x={223 + i * 11} y={120 - h * 5} width="8" height={h * 5} rx="1" fill={LINE} />
        ))}
        <rect className="hist-now" x={223 + 7 * 11} y="80" width="8" height="40" rx="1" fill={INK} />
      </g>
    </Scene>
  );
}
