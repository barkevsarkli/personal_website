import { C, MONO } from "./utils";

// Tiny mono label.
export function Label({ children, size = 7, fill = C.g4, weight = 500, anchor = "start", ...rest }) {
  return (
    <text fontFamily={MONO} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} {...rest}>
      {children}
    </text>
  );
}

// Text split into one <tspan> per glyph, hidden in the poster unless `shown`.
// Animate with typeText/eraseText on `[data-typed="<name>"] tspan`.
export function Typed({ name, text, x, y, size = 9, fill = C.ink, weight = 500, shown = false, ...rest }) {
  return (
    <text
      data-typed={name}
      x={x}
      y={y}
      fontFamily={MONO}
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      xmlSpace="preserve"
      style={{ whiteSpace: "pre" }}
      {...rest}
    >
      {[...text].map((ch, i) => (
        <tspan key={i} fillOpacity={shown ? 1 : 0}>
          {ch}
        </tspan>
      ))}
    </text>
  );
}

// A tick path centred on (x, y), sized `s`.
export function tickPath(x, y, s = 6) {
  return `M${x - s * 0.55} ${y + s * 0.02} L${x - s * 0.15} ${y + s * 0.42} L${x + s * 0.6} ${y - s * 0.45}`;
}
