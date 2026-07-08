import { ArrowRight } from "../icons";

export function CtaBanner() {
  return (
    <section className="bg-[#0a0a0a] px-6 py-20 sm:px-12">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl bg-violet-600 px-8 py-16 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10">
          <h2 className="mb-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Your store is one link away.
          </h2>
          <p className="mb-8 text-base text-white/70">
            Free to start. No credit card. No commitment.
          </p>
          <a href="#" className="inline-flex items-center gap-2 rounded-[10px] bg-white px-8 py-3.5 text-sm font-bold text-violet-700 hover:bg-violet-50 transition-colors">
            Start free <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}