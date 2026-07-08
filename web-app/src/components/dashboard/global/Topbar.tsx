import { BellIcon, MenuIcon } from "@/components/icons";
import { usePathname } from "next/navigation";

interface TopbarProps {
  onMenuClick: () => void; // Fixed 'any' type here
}
const PAGE_TITLES:Record<string ,string> = {
  "/dashboard": "Overview",
  "/dashboard/products": "Products",
  "/dashboard/orders": "Orders",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings": "Settings",
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();

  // 3. Type-cast or guard the pathname when indexing
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0d0d0d] px-5 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="text-white/50 hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <MenuIcon size={20} />
        </button>
        <h1 className="text-sm font-semibold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/8 bg-white/5 px-3 py-1.5" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.3" className="text-white/30" />
            <path d="M9 9l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-white/30" />
          </svg>
          <span className="text-xs text-white/25">Search…</span>
          <kbd className="ml-2 rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/25">⌘K</kbd>
        </div>

        {/* Bell */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/5 hover:text-white transition-colors">
          <BellIcon size={17} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-violet-500" />
        </button>

        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
          JK
        </div>
      </div>
    </header>
  );
}
