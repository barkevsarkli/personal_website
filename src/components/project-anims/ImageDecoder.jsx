import { forwardRef, useId } from "react";
import AnimStage from "./AnimStage";
import { Label } from "./parts";
import { C, DRAW, EASE, HAIR, MONO, createTimeline, drawLine, hide, pop, pulse, seal, show } from "./utils";

const DURATION = 4.5;
const ROW_H = 12.5;
const rowY = (r) => 30 + r * ROW_H;

// JFIF stream as 16-bit words; the tail is deterministic filler "scan data".
const HEADER = ["FF D8", "FF E0", "00 10", "4A 46", "49 46", "00 01", "01 00", "00 48", "00 48", "00 00", "FF C0", "00 11", "00 10", "00 10", "FF DA"];
const hex = (n) => Math.floor(n).toString(16).toUpperCase().padStart(2, "0");
const noise = (n) => {
  const s = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return (s - Math.floor(s)) * 256;
};
const WORDS = [...HEADER, ...Array.from({ length: 16 }, (_, i) => `${hex(noise(i))} ${hex(noise(i + 40))}`)];

const TAGS = [
  { label: "SOI", rows: [0, 0], at: 0.2 },
  { label: "APP0", rows: [1, 1], at: 0.4 },
  { label: "JFIF", rows: [3, 4], at: 0.6 },
  { label: "W×H", rows: [12, 13], at: 1.35 },
];

// Bold "B", 16x16.
const GLYPH = [
  "................",
  "................",
  "...#########....",
  "...##########...",
  "...###....####..",
  "...###.....###..",
  "...###....####..",
  "...#########....",
  "...##########...",
  "...###.....####.",
  "...###......###.",
  "...###......###.",
  "...###.....####.",
  "...###########..",
  "...##########...",
  "................",
];

const GRID = { x: 178, y: 26, cell: 7 };
const BLOCK = GRID.cell * 8;

// JPEG zigzag scan order of an 8x8 block, as [row, col].
const ZIGZAG = (() => {
  const out = [];
  for (let s = 0; s < 15; s++) {
    const lo = Math.max(0, s - 7);
    const hi = Math.min(s, 7);
    for (let k = 0; k <= hi - lo; k++) {
      const r = s % 2 ? lo + k : hi - k;
      out.push([r, s - r]);
    }
  }
  return out;
})();

// Ink pixels with the block they live in and their zigzag position inside it.
const PIXELS = [];
[0, 1, 2, 3].forEach((b) => {
  const br = Math.floor(b / 2) * 8;
  const bc = (b % 2) * 8;
  ZIGZAG.forEach(([r, c], z) => {
    if (GLYPH[br + r][bc + c] === "#") PIXELS.push({ r: br + r, c: bc + c, b, z });
  });
});

const zigzagPath = (b) => {
  const ox = GRID.x + (b % 2) * BLOCK + GRID.cell / 2;
  const oy = GRID.y + Math.floor(b / 2) * BLOCK + GRID.cell / 2;
  return ZIGZAG.map(([r, c], i) => `${i ? "L" : "M"}${ox + c * GRID.cell} ${oy + r * GRID.cell}`).join(" ");
};

const BLOCK_START = (b) => 1.5 + b * 0.45;
const BLOCK_TIME = 0.4;

function build(q) {
  const tl = createTimeline();
  const scroll = q("[data-scroll]");

  // Parse the header: highlight and tag the marker bytes.
  TAGS.forEach((t, i) => {
    pop(tl, q(`[data-hl="${i}"]`), t.at, { from: 1.2, duration: 0.25 });
    show(tl, q(`[data-tag="${i}"]`), t.at + 0.08, { duration: 0.15 });
  });
  tl.to(scroll, { y: -6 * ROW_H, duration: 0.4 }, 0.9);
  pulse(tl, q("[data-dim]"), 1.4, { scale: 1.2, origin: "0% 50%" });

  // Decode block by block in zigzag order while the stream keeps scrolling.
  tl.to(scroll, { y: -15 * ROW_H, duration: 1.9, ease: EASE.linear }, 1.4);
  hide(tl, q("[data-hint]"), 1.4, { duration: 0.2 });
  const cursor = q("[data-cursor]");
  show(tl, cursor, 1.45, { duration: 0.1 });
  [0, 1, 2, 3].forEach((b) => {
    const t = BLOCK_START(b);
    if (b) tl.to(cursor, { x: (b % 2) * BLOCK, y: Math.floor(b / 2) * BLOCK, duration: 0.12, ease: EASE.snap }, t - 0.06);
    drawLine(tl, q(`[data-zz="${b}"]`), t, { duration: BLOCK_TIME, ease: EASE.linear });
    hide(tl, q(`[data-zz="${b}"]`), t + BLOCK_TIME, { duration: 0.15 });
  });
  const pixels = q("[data-px]");
  tl.to(
    pixels,
    {
      opacity: 1,
      duration: 0.04,
      ease: EASE.linear,
      stagger: (i) => BLOCK_START(PIXELS[i].b) + (PIXELS[i].z / 64) * BLOCK_TIME - BLOCK_START(0),
    },
    BLOCK_START(0),
  );
  hide(tl, cursor, 3.3, { duration: 0.15 });

  // Dissolve back into bytes and rewind the stream.
  tl.to(pixels, { opacity: 0, duration: 0.14, stagger: { each: 0.004, from: "random" } }, 3.5);
  hide(tl, q("[data-hl], [data-tag]"), 3.45, { duration: 0.25 });
  tl.to(scroll, { y: 0, duration: 0.8 }, 3.45);
  show(tl, q("[data-hint]"), 4.1, { duration: 0.3 });
  return seal(tl, DURATION);
}

export default forwardRef(function ImageDecoder(_, ref) {
  const clip = `hex-${useId().replace(/:/g, "")}`;
  const lines = [];
  for (let i = 0; i <= 16; i++) {
    const p = i * GRID.cell;
    const major = i % 8 === 0;
    lines.push(
      <line key={`v${i}`} x1={GRID.x + p} y1={GRID.y} x2={GRID.x + p} y2={GRID.y + 16 * GRID.cell} stroke={major ? C.g2 : C.g1} strokeWidth={major ? 1 : 0.5} />,
      <line key={`h${i}`} x1={GRID.x} y1={GRID.y + p} x2={GRID.x + 16 * GRID.cell} y2={GRID.y + p} stroke={major ? C.g2 : C.g1} strokeWidth={major ? 1 : 0.5} />,
    );
  }

  return (
    <AnimStage
      ref={ref}
      viewBox="0 0 320 180"
      label="A JFIF byte stream scrolls by, header markers SOI, APP0, JFIF and width by height are tagged, then 8 by 8 blocks decode in zigzag order into a pixel letter B before dissolving back to bytes."
      build={build}
    >
      <defs>
        <clipPath id={clip}>
          <rect x="10" y="16" width="100" height="143" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <g data-scroll>
          {WORDS.map((w, r) => (
            <g key={r}>
              <text x="16" y={rowY(r)} fontFamily={MONO} fontSize="6" fill={C.g3}>
                {hex(r * 2).padStart(4, "0")}
              </text>
              <text x="42" y={rowY(r)} fontFamily={MONO} fontSize="8.5" fill={C.ink} xmlSpace="preserve">
                {w}
              </text>
            </g>
          ))}
          {TAGS.map((t, i) => (
            <g key={t.label}>
              <rect
                data-hl={i}
                x="39"
                y={rowY(t.rows[0]) - 8.5}
                width="31"
                height={(t.rows[1] - t.rows[0]) * ROW_H + 11}
                rx="2"
                stroke={C.ink}
                strokeWidth="1.25"
                opacity="0"
              />
              <text data-tag={i} x="76" y={rowY(t.rows[0])} fontFamily={MONO} fontSize="6.5" fontWeight="600" fill={C.ink} opacity="0">
                {t.label}
              </text>
            </g>
          ))}
        </g>
      </g>
      <line x1="10" y1="16" x2="110" y2="16" stroke={C.g1} {...HAIR} />
      <line x1="10" y1="159" x2="110" y2="159" stroke={C.g1} {...HAIR} />

      {/* bytes -> pixels */}
      <path d="M124 82 H164 M159 78 L164 82 L159 86" stroke={C.g3} {...HAIR} strokeWidth={1.25} />
      <Label x={144} y={76} size={6} fill={C.g4} anchor="middle">
        IDCT
      </Label>

      {lines}
      {PIXELS.map((p, i) => (
        <rect key={i} data-px x={GRID.x + p.c * GRID.cell} y={GRID.y + p.r * GRID.cell} width={GRID.cell} height={GRID.cell} fill={C.ink} opacity="0" />
      ))}
      <path data-hint d={zigzagPath(0)} stroke={C.g2} strokeWidth="0.6" strokeLinejoin="round" />
      {[0, 1, 2, 3].map((b) => (
        <path key={b} data-zz={b} d={zigzagPath(b)} stroke={C.g4} strokeWidth="0.75" strokeLinejoin="round" {...DRAW} opacity="0" />
      ))}
      <rect data-cursor x={GRID.x} y={GRID.y} width={BLOCK} height={BLOCK} stroke={C.ink} strokeWidth="1.75" opacity="0" />
      <rect x={GRID.x} y={GRID.y} width={16 * GRID.cell} height={16 * GRID.cell} stroke={C.ink} strokeWidth="1.5" />

      <text data-dim x={GRID.x} y="152" fontFamily={MONO} fontSize="7" fontWeight="600" fill={C.ink}>
        16×16
      </text>
      <Label x={GRID.x + 28} y={152} size={6} fill={C.g3}>
        · 4 blocks of 8×8
      </Label>
    </AnimStage>
  );
});
