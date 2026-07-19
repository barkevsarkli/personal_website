import SectionHeading from "../components/SectionHeading";
import Pop from "../components/Pop";
import { useLang } from "../i18n/LanguageContext";

export default function Experience() {
  const { t } = useLang();
  const { label, title, intro, items } = t.experience;

  return (
    <section id="experience" className="relative mx-auto max-w-5xl px-6 py-28">
      <Pop origin="topLeft">
      <SectionHeading label={label} title={title}>
        {intro}
      </SectionHeading>

      <div className="relative">
        <div className="absolute left-[7px] top-2 h-full w-px bg-gradient-to-b from-neural-blue/60 via-neural-blue/30 to-transparent md:left-[9px]" />

        <div className="space-y-8">
          {items.map((e) => (
            <div key={e.role} className="relative pl-10 md:pl-14">
              <span className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center md:h-5 md:w-5">
                <span className="absolute h-full w-full animate-pulse-glow rounded-full bg-neural-blue/30" />
                <span className="h-2 w-2 rounded-full bg-neural-blue md:h-2.5 md:w-2.5" />
              </span>

              <div className="glass glass-hover p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold text-[#0a0a0a]">{e.role}</h3>
                  <span className="font-mono text-xs text-neural-blue">{e.period}</span>
                </div>
                <p className="mt-0.5 text-sm font-medium text-neural-blue">{e.org}</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </Pop>
    </section>
  );
}
