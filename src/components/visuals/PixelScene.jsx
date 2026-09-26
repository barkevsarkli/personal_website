import Scene, { INK, LINE, MID, SOFT, MONO } from "./Scene";

// Image Decoder — raw JFIF bytes are read, the header fields are parsed, then
// the 8×8 block is decoded in JPEG zig-zag order and rendered.
const HEX = [
  "FF D8 FF E0 00 10",
  "4A 46 49 46 00 01",
  "01 00 00 48 00 48",
  "00 00 FF DB 00 43",
  "00 08 06 06 07 06",
  "05 08 07 07 07 09",
  "09 08 0A 0C 14 0D",
].map((r) => r.split(" "));
const ROW_Y = (r) => 22 + r * 14;
const BYTE_X = (c) => 36 + c * 17;

// Header fields: [row, first byte, byte count, label].
const FIELDS = [
  [0, 0, 2, "SOI"],
  [1, 0, 4, "JFIF"],
  [2, 2, 4, "72 DPI"],
  [3, 2, 2, "DQT"],
];

// The 8×8 image (0 = light … 4 = ink): a small face.
const IMG = ["00111100", "01222210", "12422421", "12222221", "12422421", "12244221", "01222210", "00111100"];
const SHADES = ["#f4f4f5", "#d4d4d8", "#a1a1aa", "#52525b", INK];
const GX = 214;
const GY = 12;
const CELL = 12;

// JPEG zig-zag scan order over an 8×8 block.
const ZIGZAG = [];
for (let s = 0; s < 15; s++) {
  const diag = [];
  for (let r = 0; r < 8; r++) {
    const c = s - r;
    if (c >= 0 && c < 8) diag.push(r * 8 + c);
  }
  ZIGZAG.push(...(s % 2 ? diag : diag.reverse()));
}

function cursorTo(tl, r, c, n, at, d = 0.2) {
  tl.to(".cursor", { attr: { x: BYTE_X(c) - 2, y: ROW_Y(r) - 7.5, width: n * 17 - 3 }, duration: d, ease: "power2.inOut" }, at);
}

function build(tl, step) {
  tl.set(".hex-row", { opacity: 0, x: -6 }, 0)
    .set(".cursor", { opacity: 0, attr: { x: BYTE_X(0) - 2, y: ROW_Y(0) - 7.5, width: 14 } }, 0)
    .set(".field", { opacity: 0, x: -6 }, 0)
    .set(".px", { opacity: 0, attr: { width: CELL - 1.5, height: CELL - 1.5 } }, 0)
    .set(".grid-frame", { stroke: LINE }, 0)
    .set(".bit", { opacity: 0 }, 0)
    .set(".dims", { opacity: 0 }, 0)
    .fromTo(".scene", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);

  // 1 — the byte stream arrives; the read cursor walks the first row.
  step(0, 0.2);
  tl.to(".hex-row", { opacity: 1, x: 0, duration: 0.3, stagger: 0.1 }, 0.3)
    .to(".cursor", { opacity: 1, duration: 0.2 }, 1.1);
  for (let c = 1; c < 6; c++) cursorTo(tl, 0, c, 1, 1.1 + c * 0.16, 0.12);

  // 2 — parse the header: markers light up and get named.
  step(1, 2.2);
  FIELDS.forEach(([r, c, n], i) => {
    const at = 2.3 + i * 0.6;
    cursorTo(tl, r, c, n, at, 0.25);
    tl.to(`.field-${i}`, { opacity: 1, x: 0, duration: 0.3 }, at + 0.25);
  });

  // 3 — decode: bytes stream into the block in zig-zag order.
  step(2, 4.9);
  tl.to(".field", { opacity: 0.35, duration: 0.4 }, 4.9);
  ZIGZAG.forEach((idx, k) => {
    tl.to(`.px-${idx}`, { opacity: 1, duration: 0.15 }, 5.0 + k * 0.065);
  });
  for (let k = 0; k < 12; k++) {
    const r = 4 + (k % 3);
    const c = (k * 2) % 6;
    const at = 5.0 + k * 0.35;
    const idx = ZIGZAG[Math.min(63, Math.round(k * 5.4))];
    cursorTo(tl, r, c, 1, at, 0.12);
    tl.set(".bit", { x: BYTE_X(c) + 6, y: ROW_Y(r) - 3, opacity: 1 }, at)
      .to(".bit", { x: GX + (idx % 8) * CELL + 4, y: GY + Math.floor(idx / 8) * CELL + 4, duration: 0.3, ease: "power1.in" }, at)
      .set(".bit", { opacity: 0 }, at + 0.3);
  }

  // 4 — render: the gaps close into a single image.
  step(3, 9.4);
  tl.to(".cursor", { opacity: 0, duration: 0.3 }, 9.4)
    .to(".px", { attr: { width: CELL, height: CELL }, duration: 0.6, ease: "power2.inOut" }, 9.6)
    .to(".grid-frame", { stroke: INK, duration: 0.4 }, 9.6)
    .to(".dims", { opacity: 1, duration: 0.4 }, 10.0);

  tl.to(".scene", { opacity: 0, duration: 0.6 }, 12.4);
}

export default function PixelScene({ steps }) {
  return (
    <Scene steps={steps} build={build} still={0.85}>
      <g className="scene">
        <rect className="cursor" height="10" rx="2" fill={SOFT} stroke={INK} strokeWidth="1" />
        {HEX.map((row, r) => (
          <g key={r} className="hex-row" fontFamily={MONO} fontSize="7.5">
            <text x="8" y={ROW_Y(r)} fill={MID}>
              {(r * 6).toString(16).toUpperCase().padStart(4, "0")}
            </text>
            {row.map((b, c) => (
              <text key={c} x={BYTE_X(c)} y={ROW_Y(r)} fill={INK}>
                {b}
              </text>
            ))}
          </g>
        ))}
        {FIELDS.map(([r, , , label], i) => (
          <g key={i} className={`field field-${i}`}>
            <line x1="138" y1={ROW_Y(r) - 2.5} x2="146" y2={ROW_Y(r) - 2.5} stroke={INK} strokeWidth="1" />
            <rect x="146" y={ROW_Y(r) - 8} width="46" height="11" rx="5.5" fill={INK} />
            <text x="169" y={ROW_Y(r) - 0.5} textAnchor="middle" fontFamily={MONO} fontSize="6.5" fill="#fff">
              {label}
            </text>
          </g>
        ))}

        {/* 8×8 block */}
        <rect className="grid-frame" x={GX - 2} y={GY - 2} width={CELL * 8 + 4} height={CELL * 8 + 4} rx="2" fill="#fff" strokeWidth="1.2" />
        {IMG.flatMap((row, r) =>
          row.split("").map((v, c) => (
            <rect key={r * 8 + c} className={`px px-${r * 8 + c}`} x={GX + c * CELL} y={GY + r * CELL} fill={SHADES[+v]} />
          ))
        )}
        <text className="dims" x={GX + 48} y={GY + 110} textAnchor="middle" fontFamily={MONO} fontSize="6.5" fill={MID}>
          8×8 · decoded
        </text>
        <rect className="bit" width="5" height="5" rx="1" fill={INK} stroke="#fff" strokeWidth="0.8" />
      </g>
    </Scene>
  );
}
