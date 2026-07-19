import SectionHeading from "../components/SectionHeading";
import Pop from "../components/Pop";
import { Icon } from "../components/Icons";
import { useLang } from "../i18n/LanguageContext";

export default function Hobbies() {
  const { t } = useLang();
  const { label, title, intro, items } = t.hobbies;

  return (
    <section id="offscreen" className="relative mx-auto max-w-4xl px-6 py-24">
      <Pop origin="topRight">
      <SectionHeading label={label} title={title}>
        {intro}
      </SectionHeading>

      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((h) => (
          <div key={h.title} className="glass glass-hover flex items-center gap-5 p-6">
            <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neural-blue/10 text-neural-blue ring-1 ring-neural-blue/20">
              <Icon name={h.icon} className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#0a0a0a]">{h.title}</h3>
              <p className="mt-1 text-sm text-zinc-600">{h.desc}</p>
            </div>
          </div>
        ))}
      </div>
      </Pop>
    </section>
  );
}
