import SectionHeading from "../components/SectionHeading";
import Pop from "../components/Pop";
import ProjectVisual from "../components/ProjectVisual";
import { useCardMotion } from "../components/project-anims";
import { useLang } from "../i18n/LanguageContext";

function ProjectCard({ project: p, wide }) {
  const { cardRef, animRef } = useCardMotion();

  return (
    <article
      ref={cardRef}
      tabIndex={0}
      className={`glass group relative flex flex-col overflow-hidden p-7 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a] ${
        wide ? "md:col-span-2" : ""
      }`}
    >
      <ProjectVisual ref={animRef} name={p.visual} wide={wide} />

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
  );
}

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
          <ProjectCard key={p.visual ?? p.title} project={p} wide={i === 0} />
        ))}
      </div>
      </Pop>
    </section>
  );
}
