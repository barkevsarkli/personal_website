export default function SectionHeading({ label, title, children }) {
  return (
    <div className="mb-12 max-w-2xl">
      {label && <span className="section-label">{label}</span>}
      <h2 className="text-3xl font-bold tracking-tight text-[#0a0a0a] sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {children && (
        <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg">
          {children}
        </p>
      )}
    </div>
  );
}
