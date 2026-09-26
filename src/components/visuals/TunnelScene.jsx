import Scene, { INK, LINE, MID, MONO } from "./Scene";

// Custom VPN — a packet is encrypted, wrapped in an outer header, carried
// through the TUN tunnel, unwrapped + decrypted, delivered, and ACKed.
const Y = 58;
// Ciphertext: a fixed pseudo-random 4×3 block pattern.
const CIPHER = [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1].map((on, i) => ({
  x: -9 + (i % 4) * 5,
  y: -5.5 + Math.floor(i / 4) * 4.2,
  on,
}));

function build(tl, step) {
  tl.set(".pkt", { x: 23, scale: 0.3, opacity: 0, transformOrigin: "50% 50%" }, 0)
    .set(".plain", { scaleX: 1, transformOrigin: "0% 50%" }, 0)
    .set(".cipher rect", { opacity: 0 }, 0)
    .set(".lock", { opacity: 0, y: -4 }, 0)
    .set(".shackle", { y: -2 }, 0)
    .set(".hdr", { opacity: 0, scale: 1.3, transformOrigin: "50% 50%" }, 0)
    .set(".hdr-tab", { opacity: 0, y: -4 }, 0)
    .set(".ack", { opacity: 0 }, 0)
    .fromTo(".scene", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0)
    .fromTo(".pipe-dash", { strokeDashoffset: 0 }, { strokeDashoffset: -9 * 40, duration: 13, ease: "none" }, 0);

  // 1 — a plaintext packet leaves the client.
  step(0, 0.2);
  tl.to(".pkt", { x: 64, scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.4);

  // 2 — encrypt: padlock snaps shut, payload scrambles into ciphertext.
  step(1, 1.6);
  tl.to(".lock", { opacity: 1, y: 0, duration: 0.3 }, 1.7)
    .to(".shackle", { y: 0, duration: 0.25, ease: "back.in(3)" }, 2.1)
    .to(".plain", { scaleX: 0, duration: 0.3, stagger: 0.08 }, 2.3)
    .to(".cipher rect", { opacity: (i) => (CIPHER[i].on ? 1 : 0.25), duration: 0.12, stagger: { each: 0.04, from: "random" } }, 2.5)
    .to(
      ".cipher rect",
      { opacity: (i) => (CIPHER[i].on ? 0.25 : 1), duration: 0.1, stagger: { each: 0.03, from: "random" }, repeat: 1, yoyo: true },
      3.0,
    );

  // 3 — encapsulate in an outer IP header.
  step(2, 3.5);
  tl.to(".hdr", { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.7)" }, 3.6).to(
    ".hdr-tab",
    { opacity: 1, y: 0, duration: 0.3 },
    3.9,
  );

  // 4 — through the tunnel.
  step(3, 4.7);
  tl.to(".pipe", { stroke: INK, duration: 0.3 }, 4.7)
    .to(".pkt", { x: 256, duration: 2.3, ease: "power1.inOut" }, 4.9)
    .to(".pipe", { stroke: LINE, duration: 0.4 }, 7.2);

  // 5 — decrypt: strip the header, open the lock, restore the payload.
  step(4, 7.3);
  tl.to(".hdr-tab", { opacity: 0, y: -8, duration: 0.3 }, 7.4)
    .to(".hdr", { opacity: 0, scale: 1.25, duration: 0.4 }, 7.5)
    .to(".shackle", { y: -2, duration: 0.25 }, 8.0)
    .to(".cipher rect", { opacity: 0, duration: 0.1, stagger: { each: 0.03, from: "random" } }, 8.2)
    .to(".plain", { scaleX: 1, duration: 0.3, stagger: 0.08 }, 8.5)
    .to(".lock", { opacity: 0, y: -4, duration: 0.3 }, 9.0);

  // 6 — deliver to the server, which ACKs back through the tunnel.
  step(5, 9.4);
  tl.to(".pkt", { x: 297, scale: 0.3, opacity: 0, duration: 0.6, ease: "power2.in" }, 9.5)
    .to(".host-r", { fill: INK, duration: 0.15, yoyo: true, repeat: 1 }, 10.0)
    .set(".ack", { attr: { cx: 280 }, opacity: 1 }, 10.4)
    .to(".ack", { attr: { cx: 40 }, duration: 1.4, ease: "power1.inOut" }, 10.4)
    .set(".ack", { opacity: 0 }, 11.8)
    .to(".host-l-screen", { fill: "#fff", duration: 0.12, yoyo: true, repeat: 1 }, 11.8);

  tl.to(".scene", { opacity: 0, duration: 0.6 }, 12.4);
}

function Host({ x, dark, cls, screenCls, label }) {
  return (
    <g>
      <rect className={cls} x={x} y="40" width="34" height="30" rx="4" fill={dark ? INK : "#fff"} stroke={INK} strokeWidth="1.5" />
      <rect className={screenCls} x={x + 5} y="45" width="24" height="16" rx="1.5" fill={dark ? "#3f3f46" : "#f4f4f5"} />
      <line x1={x + 17} y1="70" x2={x + 17} y2="77" stroke={INK} strokeWidth="2" />
      <line x1={x + 9} y1="77" x2={x + 25} y2="77" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <text x={x + 17} y="90" textAnchor="middle" fontFamily={MONO} fontSize="6.5" fill={MID}>
        {label}
      </text>
    </g>
  );
}

export default function TunnelScene({ steps }) {
  return (
    <Scene steps={steps} build={build} still={0.42}>
      <g className="scene">
        <g transform="translate(0 12)">
          <Host x={6} dark cls="host-l" screenCls="host-l-screen" label="10.0.0.2" />
          <Host x={280} cls="host-r" label="10.8.0.1" />

          {/* tunnel */}
          <text x="96" y="84" fontFamily={MONO} fontSize="6.5" fill={MID}>
            tun0
          </text>
          <text x="224" y="84" textAnchor="end" fontFamily={MONO} fontSize="6.5" fill={MID}>
            udp/1194
          </text>
          <rect className="pipe" x="92" y="44" width="136" height="28" rx="14" fill="none" stroke={LINE} strokeWidth="2" />
          <line
            className="pipe-dash"
            x1="104"
            y1={Y}
            x2="216"
            y2={Y}
            stroke={LINE}
            strokeWidth="1.5"
            strokeDasharray="4 5"
            strokeLinecap="round"
          />
          <circle className="ack" cy={Y} r="3" fill="#fff" stroke={INK} strokeWidth="1.5" />

          {/* the packet (drawn around 0,0 and moved along x) */}
          <g transform={`translate(0 ${Y})`}>
            <g className="pkt">
              <rect x="-14" y="-9" width="28" height="18" rx="3" fill="#fff" stroke={INK} strokeWidth="1.5" />
              {[
                [-5, 18],
                [-1, 13],
                [3, 16],
              ].map(([y, w], i) => (
                <rect key={i} className="plain" x="-9" y={y} width={w} height="2.4" rx="1" fill={INK} />
              ))}
              <g className="cipher">
                {CIPHER.map((c, i) => (
                  <rect key={i} x={c.x} y={c.y} width="3.4" height="3" rx="0.6" fill={INK} />
                ))}
              </g>
              <g className="hdr">
                <rect x="-21" y="-13" width="42" height="26" rx="5" fill="none" stroke={INK} strokeWidth="1.5" strokeDasharray="3 2" />
              </g>
              <g className="hdr-tab">
                <rect x="-21" y="-21" width="16" height="8" rx="2" fill={INK} />
                <text x="-13" y="-15.2" textAnchor="middle" fontFamily={MONO} fontSize="5.5" fontWeight="600" fill="#fff">
                  IP
                </text>
              </g>
              <g transform="translate(10 -18)">
                <g className="lock">
                  <path className="shackle" d="M-2.5 -2 v-2 a2.5 2.5 0 0 1 5 0 v2" fill="none" stroke={INK} strokeWidth="1.3" />
                  <rect x="-4" y="-2.5" width="8" height="6" rx="1.2" fill={INK} />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </Scene>
  );
}
