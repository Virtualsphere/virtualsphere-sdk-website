export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <div className="relative overflow-hidden bg-[#0B0B14]">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, #1A73E8 0%, transparent 40%), radial-gradient(circle at 85% 0%, #e11d2e 0%, transparent 35%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        {eyebrow && (
          <span className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#5b9df9] ring-1 ring-inset ring-white/10">
            {eyebrow}
          </span>
        )}
        <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">{subtitle}</p>}
      </div>
    </div>
  );
}
