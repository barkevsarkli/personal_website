// Lightweight inline SVG icon set (stroke-based, inherits currentColor).
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function Icon({ name, className = "h-6 w-6" }) {
  const paths = {
    cpu: (
      <>
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M10 10h4v4h-4z" />
        <path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2" />
      </>
    ),
    brain: (
      <>
        <path d="M12 5a3 3 0 0 0-5.5 1.6A3 3 0 0 0 5 12a3 3 0 0 0 2 4 3 3 0 0 0 5 1" />
        <path d="M12 5a3 3 0 0 1 5.5 1.6A3 3 0 0 1 19 12a3 3 0 0 1-2 4 3 3 0 0 1-5 1" />
        <path d="M12 5v14" />
      </>
    ),
    bot: (
      <>
        <rect x="4" y="8" width="16" height="12" rx="3" />
        <path d="M12 4v4M9 13v1M15 13v1M10 17h4M2 13v2M22 13v2" />
        <circle cx="12" cy="3.5" r="1" />
      </>
    ),
    gear: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
      </>
    ),
    wave: (
      <>
        <path d="M2 8c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2" />
        <path d="M2 13c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2" />
        <path d="M2 18c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2" />
      </>
    ),
    chess: (
      <>
        <path d="M9 3a3 3 0 0 1 6 0c0 1.5-1 2-1 3l1 2H9l1-2c0-1-1-1.5-1-3Z" />
        <path d="M8 10h8l-1 5H9z" />
        <path d="M7 15h10l1 6H6z" />
      </>
    ),
    arrow: <path d="M12 5v14M6 13l6 6 6-6" />,
    github: (
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.3 5.4 2.6 5.4 2.6a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    ),
    linkedin: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 11v6" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    cap: (
      <>
        <path d="M2 9l10-4 10 4-10 4z" />
        <path d="M6 11v5c0 1 3 2.5 6 2.5s6-1.5 6-2.5v-5" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
      </>
    ),
    rocket: (
      <>
        <path d="M5 15c-1.5 1-2 4-2 4s3-.5 4-2c.5-.8.4-1.6-.2-2.2-.6-.6-1.4-.7-1.8-.8Z" />
        <path d="M9 14c-1-1-1.5-2.5-1-4C9.5 5 13 3 19 3c0 6-2 9.5-7 10.5-1.5.5-3 0-4-1Z" />
        <circle cx="14.5" cy="7.5" r="1.5" />
      </>
    ),
    planet: (
      <>
        <circle cx="12" cy="12" r="6" />
        <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(-25 12 12)" />
      </>
    ),
    telescope: (
      <>
        <path d="m10.07 12.49-6.18 1.32a.93.93 0 0 1-1.11-.7l-.54-2.15a1.07 1.07 0 0 1 .7-1.27l13.5-4.44" />
        <path d="m13.56 11.75 4.33-.93" />
        <path d="m16 21-3.1-6.21" />
        <path d="M16.5 5.94a2 2 0 0 1 1.46-2.43l1.09-.27a1 1 0 0 1 1.21.73l1.51 6.06a1 1 0 0 1-.72 1.21l-1.09.27a2 2 0 0 1-2.43-1.45z" />
        <path d="m8 21 3.1-6.21" />
        <circle cx="12" cy="13" r="2" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="9" r="6" />
        <path d="M8.2 13.5 7 21l5-2.5L17 21l-1.2-7.5" />
      </>
    ),
    external: (
      <>
        <path d="M14 4h6v6" />
        <path d="M20 4 11 13" />
        <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      {paths[name] || null}
    </svg>
  );
}
