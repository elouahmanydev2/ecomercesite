
const STEPS = [
  { step: "1", title: "Add your products", desc: "Upload photos, write a title, set a price. Done in minutes." },
  { step: "2", title: "Copy your link", desc: "Every store gets a unique link the moment you create it." },
  { step: "3", title: "Share and sell", desc: "Post your link anywhere. Orders and payments happen automatically." },
]; 
export function HowItWorks() {
  return (
    <section className="bg-[#0a0a0a] px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-violet-400">How it works</p>
        <h2 className="mb-14 text-center text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Open for business in three steps.
        </h2>
        <div className="flex flex-col gap-0">
          {STEPS.map((s, i) => (
            <div key={s.step} className="flex gap-6">
              {/* Left: step + line */}
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                  {s.step}
                </div>
                {i < STEPS.length - 1 && <div className="mt-1 w-px flex-1 bg-violet-500/20 mb-1" style={{ minHeight: 40 }} />}
              </div>
              {/* Right: content */}
              <div className={`pb-${i < STEPS.length - 1 ? "10" : "0"} pt-1`} style={{ paddingBottom: i < STEPS.length - 1 ? 40 : 0 }}>
                <h3 className="mb-1.5 text-base font-semibold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-white/45">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}