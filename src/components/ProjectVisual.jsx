import { forwardRef, useEffect, useState } from "react";
import { PROJECT_ANIMS } from "./project-anims";

const WIDE_QUERY = "(min-width: 768px)";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

// Story animation for a project card, looked up by the project's `visual` key
// (never by position). Playback is driven by useCardMotion through the
// forwarded ref; at rest the SVG shows its designed poster frame.
const ProjectVisual = forwardRef(function ProjectVisual({ name, wide = false }, ref) {
  const Anim = PROJECT_ANIMS[name];
  const isWide = useMediaQuery(WIDE_QUERY) && wide;

  return (
    <div className="relative mb-5 flex h-44 w-full items-center justify-center overflow-hidden rounded-xl border border-[#0a0a0a]/10 bg-zinc-50 px-3 py-2 transition-colors duration-300 group-hover:border-[#0a0a0a]/30 group-focus-visible:border-[#0a0a0a]/30 sm:h-48">
      {Anim && <Anim key={isWide ? "wide" : "compact"} ref={ref} wide={isWide} />}
    </div>
  );
});

export default ProjectVisual;
