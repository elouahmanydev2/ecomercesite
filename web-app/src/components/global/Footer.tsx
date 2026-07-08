
export function Footer() {
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
