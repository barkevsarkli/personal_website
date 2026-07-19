import SectionHeading from "../components/SectionHeading";
import Pop from "../components/Pop";
import { Icon } from "../components/Icons";
import { useLang } from "../i18n/LanguageContext";

export default function About() {
  const { t } = useLang();
  const { label, title, disciplines, intro, cards, languagesTitle } = t.about;

  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28">
      <Pop origin="top">
      <SectionHeading label={label} title={title}>
        {intro}
      </SectionHeading>

      <div className="-mt-6 mb-12 flex flex-wrap items-center gap-3">
        {disciplines.map((d) => (
          <div
            key={d}
            className="inline-flex items-center gap-2.5 rounded-full border-2 border-[#0a0a0a] bg-white px-4 py-2"
          >
            <Icon name="cap" className="h-4 w-4 text-neural-blue" />
            <span className="font-mono text-sm font-semibold text-[#0a0a0a]">{d}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="glass glass-hover p-7">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neural-cyan/10 text-neural-cyan ring-1 ring-neural-cyan/20">
              <Icon name={c.icon} className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-[#0a0a0a]">{c.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-600">{c.body}</p>
          </div>
        ))}
      </div>

      <div className="glass mt-6 p-7">
        <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-[#0a0a0a]">
          <Icon name="globe" className="h-5 w-5 text-neural-blue" />
          {languagesTitle}
        </h3>
        <div className="grid gap-6 sm:grid-cols-3">
          {t.languages.map((l) => (
            <div key={l.name}>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="font-medium text-[#0a0a0a]">{l.name}</span>
                <span className="font-mono text-xs text-zinc-500">{l.level}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-neural-cyan to-neural-violet"
                  style={{ width: `${l.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      </Pop>
    </section>
  );
}
