import { NAV_LINKS } from "@/lib/utils/constants";
import { useState } from "react";

export function Navbar() {
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