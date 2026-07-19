import SectionHeading from "../components/SectionHeading";
import Pop from "../components/Pop";
import { Icon } from "../components/Icons";
import { STACK } from "../data/content";
import { useLang } from "../i18n/LanguageContext";

export default function Arsenal() {
  const { t } = useLang();
  const { label, title, intro, focus } = t.arsenal;

  return (
    <section id="arsenal" className="relative mx-auto max-w-6xl px-6 py-28">
      <Pop origin="topRight">
      <SectionHeading label={label} title={title}>
        {intro}
      </SectionHeading>

      <div className="mb-12 flex flex-wrap gap-3">
        {STACK.map((tech) => (
          <span key={tech} className="chip font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-neural-blue" />
            {tech}
          </span>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
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
