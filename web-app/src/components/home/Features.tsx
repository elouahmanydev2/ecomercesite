import { BoltIcon, ChartIcon, LinkIcon, ShieldIcon } from "../icons";

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

export function Features() {
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
