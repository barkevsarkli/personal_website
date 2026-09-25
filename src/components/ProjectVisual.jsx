// Small looping SVG motif per project, themed to what it is. Animations are
// pure CSS (see .pv-* classes) so they're cheap and always running.
const BLUE = "#0a0a0a";
const INK = "#0a0a0a";

function Chat() {
  return (
    <svg viewBox="0 0 120 60" className="h-16">
      <rect x="16" y="10" width="54" height="22" rx="9" fill={BLUE} />
      <rect x="54" y="32" width="50" height="20" rx="9" fill="#e5e7eb" />
      {[28, 38, 48].map((cx, i) => (
        <circle key={i} className="pv-dot" cx={cx} cy="21" r="3" fill="#fff" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
      {[68, 78, 88].map((cx, i) => (
        <circle key={i} className="pv-dot" cx={cx} cy="42" r="2.5" fill={BLUE} style={{ animationDelay: `${0.3 + i * 0.15}s` }} />
      ))}
    </svg>
  );
}

function MiniNet() {
  const L = [
    [18, 18],
    [18, 42],
    [60, 14],
    [60, 30],
    [60, 46],
    [102, 30],
  ];
  const E = [[0, 2], [0, 3], [1, 3], [1, 4], [2, 5], [3, 5], [4, 5]];
  return (
    <svg viewBox="0 0 120 60" className="h-16">
      {E.map(([a, b], i) => (
        <line key={i} x1={L[a][0]} y1={L[a][1]} x2={L[b][0]} y2={L[b][1]} stroke="#cbd5e1" strokeWidth="1.5" />
      ))}
      {L.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill={i === 5 ? BLUE : INK} />
      ))}
      <circle className="pv-travel" cx="18" cy="30" r="3.5" fill={BLUE} />
    </svg>
  );
}

function PixelGrid() {
  const n = 5;
  const cells = [];
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) cells.push([r, c]);
  return (
    <svg viewBox="0 0 60 60" className="h-16">
      {cells.map(([r, c], i) => (
        <rect
          key={i}
          className="pv-pixel"
          x={6 + c * 10}
          y={6 + r * 10}
          width="8"
          height="8"
          rx="1.5"
          fill={(r + c) % 3 === 0 ? BLUE : INK}
          style={{ animationDelay: `${(r + c) * 0.09}s` }}
        />
      ))}
    </svg>
  );
}

function Gears() {
  const cog = (cx, cy, r, cls, fill) => {
    const teeth = 8;
    const pts = [];
    for (let i = 0; i < teeth * 2; i++) {
      const a = (i / (teeth * 2)) * Math.PI * 2;
      const rad = i % 2 === 0 ? r : r * 0.74;
      pts.push(`${cx + Math.cos(a) * rad},${cy + Math.sin(a) * rad}`);
    }
    return (
      // Pin the rotation to the gear's exact centre via view-box coordinates —
      // more reliable across browsers (notably Safari) than fill-box "center".
      <g className={cls} style={{ transformBox: "view-box", transformOrigin: `${cx}px ${cy}px` }}>
        <polygon points={pts.join(" ")} fill={fill} />
        <circle cx={cx} cy={cy} r={r * 0.32} fill="#fff" />
      </g>
    );
  };
  return (
    <svg viewBox="0 0 120 60" className="h-16">
      {cog(44, 30, 16, "pv-spin", INK)}
      {cog(72, 22, 11, "pv-spin-rev", BLUE)}
      <g className="pv-flap">
        <line x1="44" y1="30" x2="96" y2="30" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="60" y1="30" x2="86" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

function Plane() {
  // Speed lines march (pv-dash on each line so it animates even where grouped
  // stroke inheritance fails), and the plane itself gently flies (pv-fly).
  return (
    <svg viewBox="0 0 120 60" className="h-16">
      <g stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round">
        <line className="pv-dash" x1="6" y1="22" x2="40" y2="22" />
        <line className="pv-dash" x1="2" y1="34" x2="44" y2="34" />
        <line className="pv-dash" x1="10" y1="46" x2="38" y2="46" />
      </g>
      <g className="pv-fly">
        <path d="M52 34 L96 18 L86 34 L96 50 Z" fill={BLUE} />
        <path d="M86 34 L70 34 L74 30 L86 30 Z" fill={INK} />
      </g>
    </svg>
  );
}

function Database() {
  return (
    <svg viewBox="0 0 120 60" className="h-16">
      <g transform="translate(44,8)">
        {[0, 12, 24].map((y, i) => (
          <g key={i}>
            <ellipse cx="16" cy={y + 8} rx="16" ry="5" fill={i === 0 ? BLUE : INK} />
            <rect x="0" y={y + 8} width="32" height="8" fill={i === 0 ? BLUE : INK} opacity="0.85" />
          </g>
        ))}
        <ellipse cx="16" cy="40" rx="16" ry="5" fill={INK} />
      </g>
      <rect className="pv-scan" x="40" y="12" width="40" height="3" rx="1.5" fill="#9ca3af" opacity="0.8" />
    </svg>
  );
}

function Tunnel() {
  // Two endpoints joined by a tunnel; an encrypted packet rides through it.
  return (
    <svg viewBox="0 0 120 60" className="h-16">
      <rect x="6" y="20" width="20" height="16" rx="3" fill={INK} />
      <rect x="94" y="20" width="20" height="16" rx="3" fill="#e5e7eb" />
      <line x1="16" y1="36" x2="16" y2="42" stroke={INK} strokeWidth="2" />
      <line x1="104" y1="36" x2="104" y2="42" stroke="#cbd5e1" strokeWidth="2" />
      <rect x="28" y="21" width="64" height="14" rx="7" fill="none" stroke="#cbd5e1" strokeWidth="2" />
      <line className="pv-dash" x1="32" y1="28" x2="88" y2="28" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
      <g className="pv-travel">
        <rect x="31" y="24" width="10" height="8" rx="2" fill={BLUE} />
        <path d="M33.5 24v-1.5a2.5 2.5 0 0 1 5 0V24" fill="none" stroke={BLUE} strokeWidth="1.3" />
      </g>
    </svg>
  );
}

function Bridge() {
  // A chat bubble handing messages to a local model chip.
  return (
    <svg viewBox="0 0 120 60" className="h-16">
      <path d="M10 16h26a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H20l-6 5v-5h-4a6 6 0 0 1-6-6v-8a6 6 0 0 1 6-6Z" fill="#e5e7eb" />
      {[15, 23, 31].map((cx, i) => (
        <circle key={i} className="pv-dot" cx={cx} cy="26" r="2.5" fill={INK} style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
      <line className="pv-dash" x1="48" y1="28" x2="78" y2="28" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <g stroke={INK} strokeWidth="1.5" strokeLinecap="round">
        {[20, 28, 36].map((y) => (
          <g key={y}>
            <line x1="82" y1={y} x2="86" y2={y} />
            <line x1="110" y1={y} x2="114" y2={y} />
          </g>
        ))}
      </g>
      <rect x="86" y="14" width="24" height="28" rx="4" fill={INK} />
      <rect className="pv-pixel" x="92" y="22" width="12" height="12" rx="2" fill="#fff" />
    </svg>
  );
}

function Detect() {
  // Library seats seen from above; occupied ones get blinking detection boxes.
  const seats = [
    [24, 12, true],
    [52, 12, false],
    [80, 12, true],
    [24, 36, false],
    [52, 36, true],
    [80, 36, false],
  ];
  return (
    <svg viewBox="0 0 120 60" className="h-16">
      {seats.map(([x, y, busy], i) => (
        <g key={i}>
          <rect x={x} y={y} width="16" height="12" rx="3" fill={busy ? INK : "#e5e7eb"} />
          {busy && (
            <rect
              className="pv-pixel"
              x={x - 4}
              y={y - 4}
              width="24"
              height="20"
              rx="2"
              fill="none"
              stroke={BLUE}
              strokeWidth="1.5"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          )}
        </g>
      ))}
      <rect className="pv-scan" x="16" y="6" width="88" height="2" rx="1" fill="#9ca3af" opacity="0.8" />
    </svg>
  );
}

// Looked up by each project's `visual` key (not its position in the list), so
// reordering projects never swaps their motifs.
const VISUALS = {
  chat: Chat,
  net: MiniNet,
  pixels: PixelGrid,
  gears: Gears,
  plane: Plane,
  database: Database,
  tunnel: Tunnel,
  bridge: Bridge,
  detect: Detect,
};

export default function ProjectVisual({ name }) {
  const V = VISUALS[name] ?? Chat;
  return (
    <div className="relative mb-5 flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border border-[#0a0a0a]/10 bg-gradient-to-br from-zinc-50 to-zinc-100">
      <V />
    </div>
  );
}
