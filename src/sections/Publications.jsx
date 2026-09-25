import SectionHeading from "../components/SectionHeading";
import Pop from "../components/Pop";
import { useLang } from "../i18n/LanguageContext";

// Own name, bolded in the author list (APA style: "Surname, I.").
const ME = "Şarklı, B.";

function Authors({ text }) {
  const [before, ...rest] = text.split(ME);
  if (!rest.length) return text;
  return (
    <>
      {before}
      <strong className="font-semibold text-[#0a0a0a]">{ME}</strong>
      {rest.join(ME)}
    </>
  );
}

export default function Publications() {
  const { t } = useLang();
  const { label, title, intro, items } = t.publications;

  return (
    <section id="publications" className="relative mx-auto max-w-5xl px-6 py-28">
      <Pop origin="topLeft">
      <SectionHeading label={label} title={title}>
        {intro}
      </SectionHeading>

      <div className="space-y-6">
        {items.map((p) => (
          <article key={p.title} className="glass glass-hover p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex h-5 items-center rounded-full bg-neural-blue px-2 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                {p.status}
              </span>
              <span className="font-mono text-xs text-neural-blue">{p.year}</span>
            </div>
            <h3 className="text-lg font-semibold italic leading-snug text-[#0a0a0a]">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              <Authors text={p.authors} />
            </p>
          </article>
        ))}
      </div>
      </Pop>
    </section>
  );
}
