import { Icon } from "../components/Icons";
import Pop from "../components/Pop";
import { PROFILE } from "../data/content";
import { useLang } from "../i18n/LanguageContext";

const LINKS = [
  { name: "GitHub", icon: "github", href: PROFILE.github },
  { name: "LinkedIn", icon: "linkedin", href: PROFILE.linkedin },
  { name: "Email", icon: "mail", href: `mailto:${PROFILE.email}` },
];

export default function Footer() {
  const { t } = useLang();
  const f = t.footer;

  return (
    <footer id="contact" className="relative mx-auto max-w-6xl px-6 pb-16 pt-12">
      <Pop origin="top">
      <div className="glass overflow-hidden p-10 text-center sm:p-14">
        <span className="section-label">{f.label}</span>
        <h2 className="mx-auto max-w-2xl text-3xl font-bold text-[#0a0a0a] sm:text-4xl">
          {f.titlePre}
          <span className="gradient-text">{f.titleAccent}</span>
          {f.titlePost}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-zinc-600">{f.blurb}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {LINKS.map((l) => (
            <a
              key={l.name}
              href={l.href}
              target={l.icon === "mail" ? undefined : "_blank"}
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full border-2 border-[#0a0a0a] bg-white px-5 py-3 font-semibold text-[#0a0a0a] transition-all duration-200 hover:bg-[#0a0a0a] hover:text-white"
            >
              <Icon name={l.icon} className="h-5 w-5 transition-transform group-hover:scale-110" />
              {l.name}
            </a>
          ))}
        </div>

        <p className="mt-8 font-mono text-xs text-zinc-500">{f.langLine}</p>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-3 text-xs text-zinc-400 sm:flex-row">
        <span>
          © {new Date().getFullYear()} {PROFILE.name}. {f.rights}
        </span>
        <span className="font-mono">{f.built}</span>
      </div>
      </Pop>
    </footer>
  );
}
