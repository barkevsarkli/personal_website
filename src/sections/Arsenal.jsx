import SectionHeading from "../components/SectionHeading";
import Pop from "../components/Pop";
import { Icon } from "../components/Icons";
import { STACK } from "../data/content";
import { useLang } from "../i18n/LanguageContext";

export default function Arsenal() {
  const { t } = useLang();
  const { label, title, intro, groups, focus } = t.arsenal;

  return (
    <section id="arsenal" className="relative mx-auto max-w-6xl px-6 py-28">
      <Pop origin="topRight">
      <SectionHeading label={label} title={title}>
        {intro}
      </SectionHeading>

      <div className="mb-12 space-y-6">
        {STACK.map((group) => (
          <div key={group.key} className="md:flex md:items-start md:gap-6">
            <span className="mb-3 block font-mono text-xs font-semibold uppercase tracking-[0.25em] text-neural-blue md:mb-0 md:w-60 md:shrink-0 md:pt-3">
              {groups[group.key]}
            </span>
            <div className="flex flex-wrap gap-3">
              {group.items.map((tech) => (
                <span key={tech} className="chip font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-neural-blue" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {focus.map((f) => (
          <div
            key={f.title}
            className="glass glass-hover group relative overflow-hidden p-7"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neural-blue/10 text-neural-blue ring-1 ring-neural-blue/20">
              <Icon name={f.icon} className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[#0a0a0a]">{f.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-600">{f.desc}</p>
          </div>
        ))}
      </div>
      </Pop>
    </section>
  );
}
