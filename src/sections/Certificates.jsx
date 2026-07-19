import SectionHeading from "../components/SectionHeading";
import Pop from "../components/Pop";
import { Icon } from "../components/Icons";
import { useLang } from "../i18n/LanguageContext";
import { CERTIFICATES } from "../data/content";

export default function Certificates() {
  const { t } = useLang();
  const c = t.certificates;

  return (
    <section id="certificates" className="relative mx-auto max-w-6xl px-6 py-28">
      <Pop origin="topRight">
        <SectionHeading label={c.label} title={c.title}>
          {c.intro}
        </SectionHeading>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {CERTIFICATES.map((cert) => (
            <article
              key={cert.title}
              className="glass glass-hover group flex items-start gap-5 p-6"
            >
              <div className="mt-0.5 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neural-cyan/10 text-neural-cyan ring-1 ring-neural-cyan/20 transition-transform duration-300 group-hover:scale-110">
                <Icon name="award" className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex h-5 items-center rounded-full bg-neural-blue px-2 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                    {cert.category}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-400">
                    {cert.date}
                  </span>
                </div>

                <h3 className="text-base font-bold leading-snug text-[#0a0a0a]">
                  {cert.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">{cert.issuer}</p>

                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-neural-blue transition-colors hover:underline"
                  >
                    {c.viewCredential}
                    <Icon name="external" className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </Pop>
    </section>
  );
}
