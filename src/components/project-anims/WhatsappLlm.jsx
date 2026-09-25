import { forwardRef } from "react";
import AnimStage from "./AnimStage";
import { Label, tickPath } from "./parts";
import { C, DRAW, EASE, HAIR, LINE, MONO, createTimeline, drawLine, hide, pop, pulse, seal, show } from "./utils";

const DURATION = 4.5;
const WIRE_Y = 90;
const X = { phone: 86, bridgeIn: 118, bridgeOut: 178, chip: 212 };
const TOKENS = [
  { text: "Sure", x: 25, y: 74 },
  { text: "—", x: 42, y: 74 },
  { text: "3", x: 49, y: 74 },
  { text: "key", x: 25, y: 84 },
  { text: "points.", x: 38, y: 84 },
];

function build(q) {
  const tl = createTimeline();
  const draft = q("[data-draft]");
  const sent = q("[data-sent]");
  const msg = q("[data-msg]");
  const bridge = q("[data-bridge]");
  const chip = q("[data-chip]");
  const ring = q("[data-ring]");
  const reply = q("[data-reply]");
  const words = q("[data-word]");
  const tokens = q("[data-token]");
  const ticks = q("[data-tick]");

  // Send.
  hide(tl, draft, 0.2, { duration: 0.15 });
  pulse(tl, q("[data-send]"), 0.2, { scale: 1.3, duration: 0.3 });
  pop(tl, sent, 0.25, { origin: "100% 100%" });

  // Phone -> C++ bridge -> local model.
  tl.set(msg, { opacity: 1 }, 0.5);
  tl.to(msg, { x: X.bridgeIn, duration: 0.35, ease: EASE.in }, 0.5);
  tl.set(msg, { opacity: 0 }, 0.85);
  pulse(tl, bridge, 0.85, { scale: 1.08, duration: 0.3 });
  tl.set(msg, { x: X.bridgeOut, opacity: 1 }, 1.05);
  tl.to(msg, { x: X.chip, duration: 0.3, ease: EASE.in }, 1.05);
  tl.set(msg, { opacity: 0 }, 1.35);

  // Tokens stream back one by one and land in the reply bubble.
  pop(tl, reply, 2.0, { origin: "0% 0%" });
  tokens.forEach((tok, i) => {
    const emit = 1.5 + i * 0.26;
    tl.fromTo(ring, { opacity: 0.6, scale: 1 }, { opacity: 0, scale: 1.18, transformOrigin: "50% 50%", duration: 0.35, ease: EASE.out, immediateRender: false }, emit);
    tl.set(tok, { opacity: 1 }, emit);
    tl.to(tok, { x: X.phone, duration: 0.6, ease: EASE.linear }, emit);
    tl.set(tok, { opacity: 0 }, emit + 0.6);
    show(tl, words[i], emit + 0.6, { duration: 0.08 });
  });
  pulse(tl, chip, 1.5, { scale: 1.04, duration: 1.3, ease: "sine.inOut" });

  // Delivered.
  drawLine(tl, ticks, 3.25, { duration: 0.16, stagger: 0.1 });

  // Clear back to the poster: draft in the composer, empty thread.
  hide(tl, [sent, reply, ...words, ...ticks], 3.9, { duration: 0.3 });
  show(tl, draft, 4.1, { duration: 0.25 });
  return seal(tl, DURATION);
}

function Chip() {
  const pins = [0, 1, 2, 3].map((i) => {
    const x = 219 + i * 14;
    const y = 69 + i * 14;
    return `M${x} 56 v6 M${x} 118 v6 M206 ${y} h6 M268 ${y} h6`;
  });
  return (
    <g>
      <path d={pins.join(" ")} stroke={C.ink} {...LINE} strokeWidth={1.5} />
      <g data-chip>
        <rect x="212" y="62" width="56" height="56" rx="6" fill={C.ink} />
        <rect x="224" y="74" width="32" height="32" rx="3" stroke={C.g4} {...HAIR} />
        <text x="240" y="93" fontFamily={MONO} fontSize="9" fontWeight="600" fill={C.white} textAnchor="middle">
          LLM
        </text>
      </g>
      <rect data-ring x="208" y="58" width="64" height="64" rx="9" stroke={C.ink} {...HAIR} opacity="0" />
      <Label x={240} y={138} size={6} fill={C.g3} anchor="middle">
        local · 7B
      </Label>
    </g>
  );
}

export default forwardRef(function WhatsappLlm(_, ref) {
  return (
    <AnimStage
      ref={ref}
      viewBox="0 0 320 180"
      label="A chat message travels from a phone through a C++ bridge to a local LLM chip, which streams tokens back into a reply that types in token by token and is marked delivered."
      build={build}
    >
      {/* wires */}
      <path d={`M${X.phone} ${WIRE_Y} H${X.bridgeIn} M${X.bridgeOut} ${WIRE_Y} H${X.chip}`} stroke={C.g2} {...LINE} strokeWidth={1.5} />

      {/* phone */}
      <rect x="14" y="12" width="72" height="156" rx="11" fill={C.white} stroke={C.ink} {...LINE} />
      <line x1="42" y1="19" x2="58" y2="19" stroke={C.ink} {...LINE} />
      <circle cx="24" cy="28" r="4" fill={C.g2} />
      <Label x={31} y={30} size={5.5} fill={C.ink}>
        barkev-bot
      </Label>
      <line x1="14" y1="36" x2="86" y2="36" stroke={C.g1} {...HAIR} />
      <rect x="20" y="146" width="60" height="14" rx="7" stroke={C.g2} {...HAIR} fill={C.white} />
      <text data-draft x="26" y="155" fontFamily={MONO} fontSize="5.5" fill={C.ink}>
        summarize doc
      </text>
      <circle data-send cx="74" cy="153" r="3.5" fill={C.ink} />

      <g data-sent opacity="0">
        <rect x="27" y="41" width="53" height="15" rx="5" fill={C.ink} />
        <text x="32" y="51" fontFamily={MONO} fontSize="5.5" fill={C.white}>
          summarize doc
        </text>
      </g>
      <rect data-reply x="20" y="64" width="54" height="28" rx="5" fill={C.g1} opacity="0" />
      {TOKENS.map((t) => (
        <text key={t.text} data-word x={t.x} y={t.y} fontFamily={MONO} fontSize="5.5" fill={C.ink} opacity="0">
          {t.text}
        </text>
      ))}
      <path data-tick d={tickPath(64, 98, 5)} stroke={C.ink} {...HAIR} strokeWidth={1.2} {...DRAW} opacity="0" />
      <path data-tick d={tickPath(68, 98, 5)} stroke={C.ink} {...HAIR} strokeWidth={1.2} {...DRAW} opacity="0" />

      {/* moving signals */}
      <rect data-msg x="-4" y="-3" width="8" height="6" rx="2" fill={C.ink} transform={`translate(${X.phone} ${WIRE_Y})`} opacity="0" />
      {TOKENS.map((t) => (
        <rect key={t.text} data-token x="-2.5" y="-2.5" width="5" height="5" rx="1" fill={C.g4} transform={`translate(${X.chip} ${WIRE_Y})`} opacity="0" />
      ))}
      {/* bridge */}
      <g data-bridge>
        <rect x={X.bridgeIn} y="70" width="60" height="40" rx="6" fill={C.white} stroke={C.ink} {...LINE} />
        <text x="148" y="93" fontFamily={MONO} fontSize="9" fontWeight="600" fill={C.ink} textAnchor="middle">
          {"{ C++ }"}
        </text>
      </g>
      <Label x={148} y={124} size={6} fill={C.g3} anchor="middle">
        bridge
      </Label>

      <Chip />

    </AnimStage>
  );
});
