import { forwardRef } from "react";
import AnimStage from "./AnimStage";
import { Label, Typed } from "./parts";
import { C, EASE, HAIR, LINE, MONO, createTimeline, eraseText, hide, pop, pulse, seal, show, swap, typeText } from "./utils";

const DURATION = 4.5;
const Y = 80; // tunnel axis
const X = { hostA: 44, start: 60, tunA: 80, tunB: 240, hostB: 272 };
const PACKETS = [
  { plain: "H", hex: "9F" },
  { plain: "E", hex: "3C" },
  { plain: "Y", hex: "D1" },
];
const RTT = ["RTT 3.0 ms", "RTT 2.9 ms", "RTT 3.2 ms", "RTT 3.1 ms"];

// Jagged "internet" boundary around the middle of the scene.
const ZONE = (() => {
  const pts = [];
  const zig = (x0, y0, x1, y1, n, amp) => {
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const off = i % 2 ? amp : -amp;
      const nx = -(y1 - y0), ny = x1 - x0;
      const len = Math.hypot(nx, ny);
      pts.push([x0 + (x1 - x0) * t + (nx / len) * off, y0 + (y1 - y0) * t + (ny / len) * off]);
    }
  };
  zig(114, 28, 206, 28, 12, 3);
  zig(206, 28, 206, 134, 12, 3);
  zig(206, 134, 114, 134, 12, 3);
  zig(114, 134, 114, 28, 12, 3);
  return pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ");
})();

function Host({ x, label, children }) {
  return (
    <g>
      <rect x={x - 20} y={Y - 14} width="40" height="28" rx="3" fill={C.white} stroke={C.ink} {...LINE} />
      <path d={`M${x} ${Y + 14} V${Y + 21} M${x - 8} ${Y + 21} H${x + 8}`} stroke={C.ink} {...LINE} />
      {children}
      <Label x={x} y={Y + 34} size={6.5} fill={C.g3} anchor="middle">
        {label}
      </Label>
    </g>
  );
}

function Tun({ x, id }) {
  return (
    <g data-tun={id}>
      <rect x={x - 18} y={Y - 10} width="36" height="20" rx="3" fill={C.white} stroke={C.ink} {...LINE} />
      <Label x={x} y={Y - 14} size={6.5} anchor="middle">
        tun0
      </Label>
    </g>
  );
}

function build(q) {
  const tl = createTimeline();
  const packets = q("[data-packet]");
  const tunA = q("[data-tun='a']");
  const tunB = q("[data-tun='b']");
  const received = q("[data-typed='rx'] tspan");

  packets.forEach((p, i) => {
    const s = 0.25 + i * 0.42;
    const plain = p.querySelector("[data-plain]");
    const cipher = p.querySelectorAll("[data-cipher]");
    const lock = p.querySelector("[data-lock]");

    pop(tl, p, s, { duration: 0.25 });
    tl.to(p, { x: X.tunA, duration: 0.35 }, s + 0.1);
    // Encrypt inside tun0: letter scrambles into hex and gains a lock.
    pulse(tl, tunA, s + 0.45, { scale: 1.06, duration: 0.24 });
    hide(tl, plain, s + 0.45, { duration: 0.1 });
    show(tl, cipher, s + 0.5, { duration: 0.12 });
    pop(tl, lock, s + 0.52, { duration: 0.25, origin: "50% 100%" });
    // Through the tunnel.
    tl.to(p, { x: X.tunB, duration: 0.9, ease: "power1.inOut" }, s + 0.65);
    // Decrypt at the far end.
    pulse(tl, tunB, s + 1.55, { scale: 1.06, duration: 0.24 });
    hide(tl, [...cipher, lock], s + 1.55, { duration: 0.12 });
    show(tl, plain, s + 1.6, { duration: 0.12 });
    tl.to(p, { x: X.hostB, duration: 0.3, ease: EASE.in }, s + 1.72);
    tl.to(p, { opacity: 0, scale: 0.5, transformOrigin: "50% 50%", duration: 0.15, ease: EASE.in }, s + 1.9);
    typeText(tl, received[i], s + 2.02);
  });

  // The sniffer's scan beam crosses the tunnel exactly as each packet passes.
  const beam = q("[data-beam]");
  const readout = q("[data-readout]");
  tl.to(beam, { rotation: -22, svgOrigin: "160 50", duration: 0.74 }, 0.4);
  [1.14, 1.56, 1.98].forEach((t, i) => {
    tl.to(beam, { rotation: i % 2 ? -22 : 22, svgOrigin: "160 50", duration: 0.42, ease: "sine.inOut" }, t);
    swap(tl, readout, 1, t + 0.1);
    swap(tl, readout, 0, t + 0.36);
  });
  tl.to(beam, { rotation: 0, svgOrigin: "160 50", duration: 0.5 }, 2.4);

  // Latency counter flickers around 3 ms.
  const rtt = q("[data-rtt]");
  [1, 2, 3, 1, 2, 3, 0].forEach((v, i) => swap(tl, rtt, v, 0.6 + i * 0.5));

  eraseText(tl, received, 3.9, { duration: 0.35 });
  return seal(tl, DURATION);
}

export default forwardRef(function Vpn(_, ref) {
  return (
    <AnimStage
      ref={ref}
      viewBox="0 0 320 180"
      label="Plaintext packets leave host A, are encrypted in tun0, cross the internet as unreadable noise past a sniffer, and are decrypted at host B."
      build={build}
    >
      <polygon points={ZONE} stroke={C.g2} strokeDasharray="2 3" {...HAIR} fill="none" />
      <Label x={160} y={148} size={6} fill={C.g3} anchor="middle" letterSpacing="1.5">
        INTERNET
      </Label>

      {/* sniffer */}
      <path d="M147 50 Q160 39 173 50 Q160 61 147 50 Z" stroke={C.g4} fill={C.white} {...LINE} strokeWidth={1.5} />
      <circle cx="160" cy="50" r="3" fill={C.g4} />
      <line data-beam x1="160" y1="56" x2="160" y2="104" stroke={C.g3} strokeDasharray="1.5 3" {...HAIR} />
      <rect x="178" y="42" width="24" height="12" rx="2" fill={C.white} stroke={C.g2} {...HAIR} />
      <text data-readout x="190" y="50.5" fontFamily={MONO} fontSize="6.5" fill={C.g3} textAnchor="middle">
        ····
      </text>
      <text data-readout x="190" y="50.5" fontFamily={MONO} fontSize="6.5" fontWeight="600" fill={C.ink} textAnchor="middle" opacity="0">
        ####
      </text>

      {/* tunnel */}
      <path d={`M100 ${Y - 9} H220 M100 ${Y + 9} H220`} stroke={C.g4} {...LINE} strokeWidth={1.5} />
      <ellipse cx="220" cy={Y} rx="3.5" ry="9" stroke={C.g4} strokeWidth="1.5" fill={C.white} />
      <line x1="104" y1={Y} x2="216" y2={Y} stroke={C.g2} strokeDasharray="2 4" {...HAIR} />

      <Host x={X.hostA} label="HOST A">
        <Label x={X.hostA} y={Y + 3} size={8} fill={C.ink} weight={600} anchor="middle">
          HEY
        </Label>
      </Host>
      <Host x={288} label="HOST B">
        <Typed name="rx" text="HEY" x={288} y={Y + 3} size={8} weight={600} textAnchor="middle" />
      </Host>

      <Tun x={X.tunA} id="a" />
      <Tun x={X.tunB} id="b" />
      <ellipse cx="100" cy={Y} rx="3.5" ry="9" stroke={C.g4} strokeWidth="1.5" fill="none" />

      {PACKETS.map((p) => (
        <g key={p.plain} data-packet transform={`translate(${X.start} ${Y})`} opacity="0">
          <rect x="-6" y="-6" width="12" height="12" rx="2.5" fill={C.white} stroke={C.ink} strokeWidth="1.25" />
          <rect data-cipher x="-6" y="-6" width="12" height="12" rx="2.5" fill={C.ink} opacity="0" />
          <text data-plain y="2.6" fontFamily={MONO} fontSize="7.5" fontWeight="600" fill={C.ink} textAnchor="middle">
            {p.plain}
          </text>
          <text data-cipher y="2" fontFamily={MONO} fontSize="5.5" fontWeight="600" fill={C.white} textAnchor="middle" opacity="0">
            {p.hex}
          </text>
          <g data-lock opacity="0">
            <path d="M-2 -9.5 V-11 a2 2 0 0 1 4 0 V-9.5" stroke={C.ink} strokeWidth="1.1" fill="none" />
            <rect x="-3" y="-9.5" width="6" height="4.5" rx="1" fill={C.ink} />
          </g>
        </g>
      ))}

      {RTT.map((txt, i) => (
        <text key={txt} data-rtt x="308" y="18" fontFamily={MONO} fontSize="7" fill={C.g4} textAnchor="end" opacity={i ? 0 : 1}>
          {txt}
        </text>
      ))}
    </AnimStage>
  );
});
