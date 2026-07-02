import { useState } from "react";

const avatars = [
  { initials: "JK", bg: "bg-violet-600" },
  { initials: "ML", bg: "bg-blue-600" },
  { initials: "AR", bg: "bg-emerald-600" },
  { initials: "ST", bg: "bg-amber-600" },
];

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 7h9M8 3.5L11.5 7 8 10.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.5 4.5l4 2.5-4 2.5V4.5z" fill="currentColor" />
    </svg>
  );
}

export default function StoreHero() {
  const [hoverPrimary, setHoverPrimary] = useState(false);
  const [hoverSecondary, setHoverSecondary] = useState(false);

  return (
    <section className="font-sans p-4 sm:p-8">
      {/* Hero card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] px-6 py-20 sm:px-12 sm:py-24 text-center">

        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Purple glow */}
        <div
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[480px] h-[320px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(139,92,246,0.28) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">

          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-500/35 bg-violet-500/15 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span className="text-xs font-medium uppercase tracking-widest text-violet-300">
              No code required
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-5 max-w-2xl text-5xl sm:text-6xl font-extrabold leading-[1.08] tracking-tight text-white">
            Turn your{" "}
            <span
              className="border-b-2 border-dashed border-violet-400/50 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <br />
            into a real online store.
          </h1>

          {/* Subheading */}
          <p className="mb-10 max-w-md text-base sm:text-lg font-normal leading-relaxed text-white/50">
            No coding. No website. Just one link that sells — share it anywhere
            and start getting paid today.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onMouseEnter={() => setHoverPrimary(true)}
              onMouseLeave={() => setHoverPrimary(false)}
              className={`inline-flex items-center gap-2 rounded-[10px] px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-150 ${
                hoverPrimary ? "bg-violet-700" : "bg-violet-600"
              }`}
            >
              Start free
              <ArrowRight />
            </button>

            <button
              onMouseEnter={() => setHoverSecondary(true)}
              onMouseLeave={() => setHoverSecondary(false)}
              className={`inline-flex items-center gap-2 rounded-[10px] border px-7 py-3.5 text-sm font-medium transition-colors duration-150 ${
                hoverSecondary
                  ? "border-white/20 bg-white/10 text-white/90"
                  : "border-white/12 bg-white/7 text-white/75"
              }`}
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            >
              <PlayIcon />
              View demo
            </button>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center gap-4">
            {/* Stacked avatars */}
            <div className="flex">
              {avatars.map((av, i) => (
                <div
                  key={av.initials}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0a0a0a] text-[10px] font-bold text-white ${av.bg} ${
                    i !== 0 ? "-ml-2" : ""
                  }`}
                >
                  {av.initials}
                </div>
              ))}
            </div>

            {/* Text */}
            <div className="text-left">
              <div className="text-xs tracking-wide text-amber-400">★★★★★</div>
              <div className="text-xs text-white/40">
                <span className="font-medium text-white/70">4,200+</span> stores
                launched this month
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}