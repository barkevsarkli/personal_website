import { PROFILE } from "../data/content";
import { useLang } from "../i18n/LanguageContext";
import { Icon } from "../components/Icons";
import { scrollToId } from "../lib/smoothScroll";

export default function Hero() {
  const { t } = useLang();
  const scrollToAbout = () => scrollToId("about");

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <h1 className="max-w-5xl text-4xl font-extrabold leading-[1.05] tracking-tight text-[#0a0a0a] sm:text-6xl md:text-7xl">
        <span className="reveal block">{PROFILE.name}</span>
        <span className="reveal mt-2 block gradient-text">{t.hero.title}</span>
      </h1>

      <p className="reveal mt-6 max-w-xl text-lg text-zinc-600 sm:text-xl">
        {t.hero.tagline}
      </p>

      <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-4">
        <button onClick={scrollToAbout} className="btn-primary group">
          <span>{t.hero.ctaPrimary}</span>
          <Icon
            name="arrow"
            className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5"
          />
        </button>
        <button onClick={() => scrollToId("contact")} className="btn-secondary">
          {t.hero.ctaSecondary}
        </button>
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-400 transition-colors hover:text-neural-blue"
        aria-label="Scroll down"
      >
        <Icon name="arrow" className="h-7 w-7 animate-float" />
      </button>
    </section>
  );
}
