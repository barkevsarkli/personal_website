import SectionHeading from "../components/SectionHeading";
import Pop from "../components/Pop";
import { Icon } from "../components/Icons";
import { useLang } from "../i18n/LanguageContext";

// Pin each place by NAME so Google geocodes the exact building (more reliable
// than hand-picked coordinates). Kept out of translations — these are queries.
const ISTANBUL = [
  { q: "Sahakyan Nunyan Ermeni Okulu, Samatya, Fatih, İstanbul", z: 16 },
  { q: "Getronagan Ermeni Lisesi, Karaköy, Beyoğlu, İstanbul", z: 16 },
  { q: "Kadir Has Üniversitesi Cibali Kampüsü, Fatih, İstanbul", z: 16 },
];
const RWU = { q: "Hochschule Ravensburg-Weingarten RWU, Weingarten, Germany", z: 15 };

const mapSrc = (q, z, hl) =>
  `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${z}&hl=${hl}&output=embed`;

function MapFrame({ title, q, z, hl, hint, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <iframe
        title={title}
        src={mapSrc(q, z, hl)}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <div className="pointer-events-none absolute left-2 top-2 flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-zinc-700 shadow-sm backdrop-blur">
        <Icon name="pin" className="h-3 w-3 text-neural-blue" />
        {hint}
      </div>
    </div>
  );
}

export default function Education() {
  const { t, lang } = useLang();
  const ed = t.education;

  return (
    <section id="education" className="relative mx-auto max-w-6xl px-6 py-28">
      <Pop origin="topLeft">
      <SectionHeading label={ed.label} title={ed.title}>
        {ed.intro}
      </SectionHeading>

      {/* ---- In Istanbul ---- */}
      <div className="mb-5 flex items-center gap-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-neural-blue">
          {ed.istanbulHeading}
        </span>
        <span className="h-px flex-1 bg-zinc-200" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {ed.schools.map((s, i) => (
          <article key={s.name} className="glass glass-hover overflow-hidden">
            <MapFrame
              title={s.name}
              q={ISTANBUL[i].q}
              z={ISTANBUL[i].z}
              hl={lang}
              hint={s.place}
              className="aspect-[4/3] w-full"
            />
            <div className="p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex h-6 items-center rounded-full bg-neural-blue px-2.5 font-mono text-xs font-bold text-white">
                  {s.year}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                  {s.note}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-bold leading-tight text-[#0a0a0a]">{s.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
                <Icon name="pin" className="h-3.5 w-3.5 text-zinc-400" />
                {s.place}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* ---- Abroad — RWU exchange ---- */}
      <div className="mb-5 mt-14 flex items-center gap-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-neural-blue">
          {ed.abroadHeading}
        </span>
        <span className="h-px flex-1 bg-zinc-200" />
      </div>

      <article className="glass glass-hover overflow-hidden md:flex">
        <MapFrame
          title={ed.abroad.name}
          q={RWU.q}
          z={RWU.z}
          hl={lang}
          hint={ed.mapHintAbroad}
          className="aspect-[16/10] w-full md:aspect-auto md:w-1/2"
        />
        <div className="flex flex-col justify-center p-7 md:w-1/2">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-6 items-center rounded-full bg-neural-blue px-2.5 font-mono text-xs font-bold text-white">
              {ed.abroad.year}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-2.5 py-1 font-mono text-[11px] font-semibold text-zinc-600">
              <Icon name="globe" className="h-3.5 w-3.5 text-neural-blue" />
              {ed.abroad.note}
            </span>
          </div>
          <h3 className="mt-4 text-xl font-bold leading-tight text-[#0a0a0a]">{ed.abroad.name}</h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-zinc-500">
            <Icon name="pin" className="h-3.5 w-3.5 text-zinc-400" />
            {ed.abroad.place} · {ed.abroad.period}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">{ed.abroad.desc}</p>
        </div>
      </article>
      </Pop>
    </section>
  );
}
