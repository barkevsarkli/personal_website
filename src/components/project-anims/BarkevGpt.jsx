import { forwardRef } from "react";
import AnimStage from "./AnimStage";
import { Label, Typed, tickPath } from "./parts";
import { C, DRAW, EASE, HAIR, LINE, MONO, createTimeline, drawLine, eraseText, hide, pulse, seal, show, travel, typeText } from "./utils";

const DURATION = 5;
const PROMPT = "plan my week";
const STEPS = ["read calendar", "write plan.md", "run sync.sh"];
const ANSWER = ["✓ week planned", "3 blocks · plan.md saved"];

// The wide card gets a panoramic composition; phones get a compact one.
const LAYOUTS = {
  wide: {
    viewBox: "0 0 640 180",
    prompt: { x: 24, y: 30, w: 170, h: 30, size: 11 },
    answer: { x: 24, y: 104, w: 200, h: 46, size: 9 },
    screen: { x: 236, y: 58, w: 128, h: 80 },
    cloud: { cx: 300, cy: 26, s: 1 },
    tag: { x: 336, y: 19 },
    plan: { x: 408, rows: [70, 102, 134], size: 9.5, header: 44 },
    tools: { x: 590, s: 1 },
  },
  compact: {
    viewBox: "0 0 320 180",
    prompt: { x: 10, y: 10, w: 118, h: 24, size: 8.5 },
    answer: { x: 10, y: 134, w: 142, h: 36, size: 6.8 },
    screen: { x: 20, y: 52, w: 98, h: 60 },
    cloud: { cx: 290, cy: 22, s: 0.8 },
    tag: { x: 220, y: 16 },
    plan: { x: 148, rows: [66, 96, 126], size: 7.5, header: 44 },
    tools: { x: 290, s: 0.85 },
  },
};

const charW = (size) => size * 0.6;
const core = (L) => ({ x: L.screen.x + L.screen.w / 2, y: L.screen.y + L.screen.h / 2 - 2 });
const labelX = (L) => L.plan.x + 18;
const lineStart = (L) => labelX(L) + charW(L.plan.size) * 14 + 4;
const lineEnd = (L) => L.tools.x - 16 * L.tools.s;

function Calendar() {
  return (
    <g>
      <rect x="-11" y="-10" width="22" height="20" rx="3" />
      <path d="M-11 -4 H11 M-5 -13 V-7 M5 -13 V-7" />
      <path d="M-6 1 h0.1 M0 1 h0.1 M6 1 h0.1 M-6 6 h0.1 M0 6 h0.1" strokeWidth="2.2" />
    </g>
  );
}
function File() {
  return (
    <g>
      <path d="M-8 -11 H3 L8 -6 V11 H-8 Z M3 -11 V-6 H8" />
      <path d="M-4 -1 H4 M-4 3 H4 M-4 7 H1" />
    </g>
  );
}
function Terminal() {
  return (
    <g>
      <rect x="-11" y="-9" width="22" height="18" rx="3" />
      <path d="M-6 -3 L-2 0 L-6 3 M0 4 H5" />
    </g>
  );
}
const TOOLS = [Calendar, File, Terminal];

function makeBuild(L) {
  const c = core(L);
  const tail = { x: L.prompt.x + L.prompt.w - 18, y: L.prompt.y + L.prompt.h + 6 };
  return function build(q) {
    const tl = createTimeline();
    const prompt = q("[data-typed='prompt'] tspan");
    const caret = q("[data-caret]");

    // User prompt types in and is handed to the on-device agent.
    hide(tl, caret, 0.1, { duration: 0.05 });
    typeText(tl, prompt, 0.15, { each: 0.06 });
    const dot = q("[data-dot]");
    tl.set(dot, { opacity: 1 }, 0.95);
    travel(tl, dot, [[0, 0], [c.x - tail.x, c.y - tail.y]], 0.95, { duration: 0.3, ease: EASE.in });
    tl.set(dot, { opacity: 0 }, 1.25);
    pulse(tl, q("[data-core]"), 1.25, { scale: 1.35, duration: 0.4 });
    tl.to(q("[data-ring]"), { rotation: 360, svgOrigin: `${c.x} ${c.y}`, duration: 3.65, ease: EASE.linear }, 1.25);

    // The plan unfolds.
    drawLine(tl, q("[data-branch]"), 1.3, { duration: 0.35 });
    STEPS.forEach((_, i) => {
      hide(tl, q(`[data-skel="${i}"]`), 1.5 + i * 0.1, { duration: 0.15 });
      tl.fromTo(q(`[data-step="${i}"]`), { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.25, ease: EASE.out, immediateRender: false }, 1.52 + i * 0.1);
    });

    // Each step calls a local tool, which pulses and ticks the step off.
    STEPS.forEach((_, i) => {
      const s = 1.85 + i * 0.6;
      const tool = q(`[data-tool="${i}"]`);
      tl.to(q(`[data-box="${i}"]`), { attr: { stroke: C.ink }, duration: 0.15 }, s);
      drawLine(tl, q(`[data-call="${i}"]`), s, { duration: 0.2, ease: EASE.in });
      tl.to(tool, { attr: { stroke: C.ink }, duration: 0.12 }, s + 0.18);
      pulse(tl, tool, s + 0.18, { scale: 1.22, duration: 0.34 });
      drawLine(tl, q(`[data-tick="${i}"]`), s + 0.34, { duration: 0.16, ease: EASE.out });
      tl.to(tool, { attr: { stroke: C.g4 }, duration: 0.25 }, s + 0.6);
      tl.to(q(`[data-call="${i}"]`), { attr: { stroke: C.g2 }, duration: 0.25 }, s + 0.5);
    });

    // Final answer, then everything settles back to the poster.
    tl.fromTo(q("[data-answer]"), { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.4, ease: EASE.snap, immediateRender: false }, 3.65);
    eraseText(tl, prompt, 4.35, { duration: 0.3 });
    hide(tl, q("[data-answer], [data-branch], [data-call], [data-tick], [data-step]"), 4.35, { duration: 0.35 });
    show(tl, q("[data-skel]"), 4.45, { duration: 0.3 });
    tl.to(q("[data-box]"), { attr: { stroke: C.g3 }, duration: 0.3 }, 4.45);
    show(tl, caret, 4.85, { duration: 0.1 });
    return seal(tl, DURATION);
  };
}

const BUILDS = { wide: makeBuild(LAYOUTS.wide), compact: makeBuild(LAYOUTS.compact) };

export default forwardRef(function BarkevGpt({ wide = false }, ref) {
  const key = wide ? "wide" : "compact";
  const L = LAYOUTS[key];
  const c = core(L);
  const { prompt: P, answer: A, screen: S, plan } = L;
  const tail = { x: P.x + P.w - 18, y: P.y + P.h + 6 };
  const px = plan.x - 10;
  const branch = `M${S.x + S.w} ${c.y} H${px} M${px} ${plan.rows[0]} V${plan.rows[2]} ${plan.rows.map((y) => `M${px} ${y} H${plan.x - 3}`).join(" ")}`;
  const cloud = L.cloud;

  return (
    <AnimStage
      ref={ref}
      viewBox={L.viewBox}
      label="Offline agent: a prompt is typed into an on-device assistant with the cloud crossed out, the agent unfolds a three-step plan, calls local calendar, file and terminal tools one by one, ticks each step and replies."
      build={BUILDS[key]}
    >
      {/* crossed-out cloud + OFFLINE */}
      <g transform={`translate(${cloud.cx} ${cloud.cy}) scale(${cloud.s})`}>
        <path d="M-16 9 H14 a8 8 0 0 0 0 -16 a11 11 0 0 0 -21 -3 a8 8 0 0 0 -9 19 Z" stroke={C.g3} {...LINE} strokeWidth={1.5} fill={C.white} />
        <line x1="-20" y1="14" x2="20" y2="-16" stroke={C.ink} {...LINE} />
      </g>
      <rect x={L.tag.x} y={L.tag.y} width="44" height="13" rx="3" stroke={C.ink} strokeWidth="1.25" fill={C.white} />
      <text x={L.tag.x + 22} y={L.tag.y + 9} fontFamily={MONO} fontSize="7" fontWeight="600" fill={C.ink} textAnchor="middle" letterSpacing="0.8">
        OFFLINE
      </text>

      {/* prompt bubble */}
      <path d={`M${tail.x - 6} ${P.y + P.h - 1} L${tail.x + 4} ${tail.y} L${tail.x + 6} ${P.y + P.h - 1} Z`} fill={C.ink} />
      <rect x={P.x} y={P.y} width={P.w} height={P.h} rx="8" fill={C.ink} />
      <text x={P.x + 10} y={P.y + P.h / 2 + P.size * 0.36} fontFamily={MONO} fontSize={P.size} fill={C.g3}>
        ›
      </text>
      <rect data-caret x={P.x + 12 + charW(P.size)} y={P.y + P.h / 2 - P.size * 0.45} width={charW(P.size) * 0.9} height={P.size * 0.9} fill={C.white} opacity="0.85" />
      <Typed name="prompt" text={PROMPT} x={P.x + 12 + charW(P.size)} y={P.y + P.h / 2 + P.size * 0.36} size={P.size} fill={C.white} />
      <circle data-dot cx={tail.x} cy={tail.y} r="3" fill={C.ink} opacity="0" />

      {/* device with the agent core */}
      <rect x={S.x} y={S.y} width={S.w} height={S.h} rx="6" fill={C.white} stroke={C.ink} {...LINE} />
      <path d={`M${S.x - 14} ${S.y + S.h + 8} L${S.x} ${S.y + S.h} H${S.x + S.w} L${S.x + S.w + 14} ${S.y + S.h + 8} Z`} fill={C.white} stroke={C.ink} {...LINE} />
      <circle data-ring cx={c.x} cy={c.y} r="15" stroke={C.g3} strokeDasharray="3 4" {...HAIR} strokeWidth={1.25} />
      <circle data-core cx={c.x} cy={c.y} r="8" fill={C.ink} />
      <Label x={c.x} y={c.y + 27} size={6.5} fill={C.g4} anchor="middle" letterSpacing="1">
        AGENT
      </Label>

      {/* plan */}
      <Label x={plan.x} y={plan.header} size={6.5} fill={C.g3} letterSpacing="1.5">
        PLAN
      </Label>
      <path data-branch d={branch} stroke={C.g4} strokeWidth="1.25" strokeLinecap="round" {...DRAW} opacity="0" />
      {STEPS.map((step, i) => {
        const y = plan.rows[i];
        const Tool = TOOLS[i];
        return (
          <g key={step}>
            <rect data-box={i} x={plan.x} y={y - 5.5} width="11" height="11" rx="2.5" stroke={C.g3} strokeWidth="1.5" fill={C.white} />
            <path data-tick={i} d={tickPath(plan.x + 5.5, y, 6)} stroke={C.ink} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...DRAW} opacity="0" />
            <rect data-skel={i} x={labelX(L)} y={y - 3} width={charW(plan.size) * (step.length - 1)} height="6" rx="3" fill={C.g1} />
            <text data-step={i} x={labelX(L)} y={y + plan.size * 0.36} fontFamily={MONO} fontSize={plan.size} fill={C.ink} opacity="0">
              {step}
            </text>
            <line data-call={i} x1={lineStart(L)} y1={y} x2={lineEnd(L)} y2={y} stroke={C.ink} strokeWidth="1.25" strokeLinecap="round" {...DRAW} opacity="0" />
            <g transform={`translate(${L.tools.x} ${y}) scale(${L.tools.s})`}>
              <g data-tool={i} stroke={C.g4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill={C.white}>
                <Tool />
              </g>
            </g>
          </g>
        );
      })}

      {/* answer */}
      <g data-answer opacity="0">
        <rect x={A.x} y={A.y} width={A.w} height={A.h} rx="8" fill={C.white} stroke={C.ink} {...LINE} />
        <text x={A.x + 10} y={A.y + A.h * 0.42} fontFamily={MONO} fontSize={A.size} fontWeight="600" fill={C.ink}>
          {ANSWER[0]}
        </text>
        <text x={A.x + 10} y={A.y + A.h * 0.42 + A.size * 1.45} fontFamily={MONO} fontSize={A.size * 0.9} fill={C.g4}>
          {ANSWER[1]}
        </text>
      </g>
    </AnimStage>
  );
});
