'use client'

import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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

function LinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M8.5 11.5a4 4 0 0 0 5.66 0l2-2a4 4 0 0 0-5.66-5.66l-1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11.5 8.5a4 4 0 0 0-5.66 0l-2 2a4 4 0 0 0 5.66 5.66l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M11 2L4 11h7l-2 7 9-10h-7l2-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2l7 3v5c0 4-3 7-7 8C6 17 3 14 3 10V5l7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 14l4-5 4 3 4-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Features", "Pricing", "Testimonials", "Blog"];

const AVATARS = [
  { initials: "JK", bg: "bg-violet-600" },
  { initials: "ML", bg: "bg-blue-600" },
  { initials: "AR", bg: "bg-emerald-600" },
  { initials: "ST", bg: "bg-amber-600" },
];

const FEATURES = [
  {
    icon: <LinkIcon />,
    title: "One link, everything",
    desc: "Your store lives at a single shareable URL. Post it anywhere — Instagram, TikTok, email, DMs.",
  },
  {
    icon: <BoltIcon />,
    title: "Live in 60 seconds",
    desc: "Add your products, set your prices, and you're open. No domains, no hosting, no setup hell.",
  },
  {
    icon: <ShieldIcon />,
    title: "Payments handled",
    desc: "Stripe-powered checkout baked in. Payouts go straight to your bank, on your schedule.",
  },
  {
    icon: <ChartIcon />,
    title: "Know what's selling",
    desc: "See views, clicks, and revenue in one clean dashboard. No analytics degree required.",
  },
];

const STEPS = [
  { step: "1", title: "Add your products", desc: "Upload photos, write a title, set a price. Done in minutes." },
  { step: "2", title: "Copy your link", desc: "Every store gets a unique link the moment you create it." },
  { step: "3", title: "Share and sell", desc: "Post your link anywhere. Orders and payments happen automatically." },
];

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

// ─── Components ───────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-12">
      <span className="text-lg font-bold tracking-tight text-white">
        link<span className="text-violet-400">store</span>
      </span>
      {/* Desktop links */}
      <div className="hidden sm:flex items-center gap-8">
        {NAV_LINKS.map((l) => (
          <a key={l} href="#" className="text-sm text-white/50 hover:text-white/90 transition-colors">
            {l}
          </a>
        ))}
      </div>
      <div className="hidden sm:flex items-center gap-3">
        <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Log in</a>
        <a href="#" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors">
          Start free
        </a>
      </div>
      {/* Mobile hamburger */}
      <button className="sm:hidden text-white/60" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
          {open
            ? <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            : <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
        </svg>
      </button>
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-[#111] border-t border-white/10 px-6 py-4 flex flex-col gap-4 sm:hidden">
          {NAV_LINKS.map((l) => (
            <a key={l} href="#" className="text-sm text-white/60 hover:text-white">{l}</a>
          ))}
          <a href="#" className="mt-1 rounded-lg bg-violet-600 px-4 py-2.5 text-center text-sm font-semibold text-white">Start free</a>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] px-6 pb-24 pt-6 sm:px-12 text-center">
      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Glow */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[560px] h-[360px]"
        style={{ background: "radial-gradient(ellipse at center, rgba(139,92,246,0.30) 0%, transparent 68%)" }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Badge */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-500/35 bg-violet-500/15 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          <span className="text-xs font-medium uppercase tracking-widest text-violet-300">No code required</span>
        </div>

        {/* Headline */}
        <h1 className="mb-5 max-w-2xl text-5xl sm:text-6xl font-extrabold leading-[1.08] tracking-tight text-white">
          Turn your{" "}
          <span className="border-b-2 border-dashed border-violet-400/50 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <br />
          into a real online store.
        </h1>

        {/* Sub */}
        <p className="mb-10 max-w-md text-base sm:text-lg leading-relaxed text-white/50">
          No coding. No website. Just one link that sells — share it anywhere and start getting paid today.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a href="#" className="inline-flex items-center gap-2 rounded-[10px] bg-violet-600 px-7 py-3.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors">
            Start free <ArrowRight />
          </a>
          <a href="#" className="inline-flex items-center gap-2 rounded-[10px] border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-white/75 hover:bg-white/10 transition-colors">
            <PlayIcon /> View demo
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex items-center gap-4">
          <div className="flex">
            {AVATARS.map((av, i) => (
              <div
                key={av.initials}
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0a0a0a] text-[10px] font-bold text-white ${av.bg} ${i !== 0 ? "-ml-2" : ""}`}
              >
                {av.initials}
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs text-amber-400">★★★★★</div>
            <div className="text-xs text-white/40">
              <span className="font-medium text-white/70">4,200+</span> stores launched this month
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="bg-[#0d0d0d] px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-violet-400">Why linkstore</p>
        <h2 className="mb-14 text-center text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Everything you need. Nothing you don't.
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-white/7 bg-white/3 p-6" style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.03)" }}>
              <div className="mb-4 inline-flex items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 p-2.5 text-violet-400">
                {f.icon}
              </div>
              <h3 className="mb-2 text-base font-semibold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-white/45">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
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

function Testimonials() {
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

function CtaBanner() {
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

function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 px-6 py-10 sm:px-12">
      <div className="mx-auto flex max-w-5xl flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-base font-bold text-white">
          link<span className="text-violet-400">store</span>
        </span>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Support"].map((l) => (
            <a key={l} href="#" className="text-xs text-white/35 hover:text-white/60 transition-colors">{l}</a>
          ))}
        </div>
        <p className="text-xs text-white/25">© 2025 linkstore. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans antialiased">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </div>
  );
}