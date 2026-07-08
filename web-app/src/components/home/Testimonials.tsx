
const TESTIMONIALS = [
  {
    name: "Sofia R.",
    handle: "@sofiadesigns",
    avatar: "SR",
    bg: "bg-pink-600",
    quote: "I was skeptical, but I made my first sale within an hour of setting up. No tech skills needed — it really is just a link.",
  },
  {
    name: "Marcus T.",
    handle: "@marcusbeats",
    avatar: "MT",
    bg: "bg-violet-600",
    quote: "I sell sample packs and presets. Dropped the link in my bio and it just works. I've stopped thinking about the store — I just make music.",
  },
  {
    name: "Priya N.",
    handle: "@priyacooks",
    avatar: "PN",
    bg: "bg-emerald-600",
    quote: "Moved over from a platform that took 30% of every sale. This is so much better — and my customers actually checkout faster.",
  },
];


export function Testimonials() {
  return (
    <section className="bg-[#0d0d0d] px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-violet-400">Testimonials</p>
        <h2 className="mb-14 text-center text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Real sellers. Real sales.
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-xl border border-white/7 p-6 flex flex-col gap-4" style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}>
              <div className="text-amber-400 text-xs tracking-wider">★★★★★</div>
              <p className="text-sm leading-relaxed text-white/60 flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${t.bg}`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-xs text-white/35">{t.handle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}