import { useEffect, useState } from "react";
import { PROFILE } from "../data/content";
import { useLang } from "../i18n/LanguageContext";
import { LANGS } from "../i18n/translations";
import { scrollToId, scrollToTop } from "../lib/smoothScroll";

const NAV_IDS = ["about", "certificates", "arsenal", "experience", "projects", "contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { t, lang, setLang } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => scrollToId(id);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 transition-all duration-300 ${
          scrolled
            ? "mx-4 rounded-full border-2 border-[#0a0a0a] bg-white/85 py-2.5 backdrop-blur-xl sm:mx-auto"
            : "py-2"
        }`}
      >
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 font-mono text-sm font-semibold text-[#0a0a0a]"
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-neural-blue" />
          {PROFILE.name.split(" ")[0]}
          <span className="text-zinc-400">.com</span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_IDS.map((id) => (
            <button
              key={id}
              onClick={() => go(id)}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-[#0a0a0a]"
            >
              {t.nav[id]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="flex items-center rounded-full border-2 border-[#0a0a0a] p-0.5">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                aria-pressed={lang === l.code}
                className={`rounded-full px-2.5 py-1 font-mono text-xs font-semibold transition-colors ${
                  lang === l.code
                    ? "bg-[#0a0a0a] text-white"
                    : "text-zinc-500 hover:text-[#0a0a0a]"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => go("contact")}
            className="hidden rounded-full border-2 border-[#0a0a0a] bg-[#0a0a0a] px-4 py-1.5 text-sm font-semibold text-white transition-all hover:border-neural-blue hover:bg-neural-blue sm:block"
          >
            {t.nav.connect}
          </button>
        </div>
      </nav>
    </header>
  );
}
