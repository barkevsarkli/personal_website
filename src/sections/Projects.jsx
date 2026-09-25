import SectionHeading from "../components/SectionHeading";
import Pop from "../components/Pop";
import ProjectVisual from "../components/ProjectVisual";
import { useLang } from "../i18n/LanguageContext";

const ACCENTS = ["cyan", "violet", "blue", "cyan", "violet", "blue", "cyan", "violet", "blue"];
const accentRing = {
  cyan: "hover:shadow-[8px_8px_0_0_rgba(10,10,10,0.18)]",
  violet: "hover:shadow-[8px_8px_0_0_rgba(10,10,10,0.18)]",
  blue: "hover:shadow-[8px_8px_0_0_rgba(10,10,10,0.18)]",
};

export default function Projects() {
  const { t } = useLang();
  const { label, title, intro, items } = t.projects;

  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-28">
      <Pop origin="top">
      <SectionHeading label={label} title={title}>
        {intro}
      </SectionHeading>

      <div className="grid gap-6 md:grid-cols-2">
        {items.map((p, i) => (
          <article
            key={p.title}
            className={`glass group relative flex flex-col overflow-hidden p-7 transition-all duration-300 ${
              accentRing[ACCENTS[i % ACCENTS.length]]
            } ${i === 0 ? "md:col-span-2" : ""}`}
          >
            <ProjectVisual name={p.visual} />

            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-neural-blue">
                {p.tag}
              </span>
              <span className="font-mono text-xs text-zinc-400">{p.year}</span>
            </div>

            <h3 className="mb-3 text-xl font-bold text-[#0a0a0a] sm:text-2xl">{p.title}</h3>
            <p className="mb-5 max-w-2xl text-sm leading-relaxed text-zinc-600">{p.desc}</p>

            <div className="mt-auto flex flex-wrap gap-2">
              {p.highlights.map((h) => (
                <span
                  key={h}
                  className="rounded-md border border-[#0a0a0a]/25 bg-white px-2.5 py-1 font-mono text-xs text-zinc-700"
                >
                  {h}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
      </Pop>
    </section>
  );
}
