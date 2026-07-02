"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M3 9.5L10 3l7 6.5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 18v-6h6v6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function BoxIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M16 7l-6-4-6 4v6l6 4 6-4V7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M4 7l6 4 6-4M10 11v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ReceiptIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M4 3h12v15l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5V3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 8h6M7 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M3 14l4-5 4 3 4-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function GearIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function LinkIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M8.5 11.5a4 4 0 0 0 5.66 0l2-2a4 4 0 0 0-5.66-5.66l-1 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11.5 8.5a4 4 0 0 0-5.66 0l-2 2a4 4 0 0 0 5.66 5.66l1-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2a6 6 0 0 1 6 6v3l1.5 2.5H2.5L4 11V8a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8 16a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV = [
  { label: "Overview",  href: "/dashboard",           icon: HomeIcon },
  { label: "Products",  href: "/dashboard/products",  icon: BoxIcon },
  { label: "Orders",    href: "/dashboard/orders",    icon: ReceiptIcon },
  { label: "Analytics", href: "/dashboard/analytics", icon: ChartIcon },
  { label: "Settings",  href: "/dashboard/settings",  icon: GearIcon },
];

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({ open, onClose }:any) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-[#0d0d0d] border-r border-white/5 transition-transform duration-200",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/5">
          <Link href="/" className="text-base font-bold tracking-tight text-white">
            link<span className="text-violet-400">store</span>
          </Link>
          <button onClick={onClose} className="text-white/40 hover:text-white lg:hidden">
            <CloseIcon />
          </button>
        </div>

        {/* Store link pill */}
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-2">
            <LinkIcon size={14} />
            <span className="text-xs text-violet-300 truncate font-medium">linkstore.io/mystore</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={[
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                    : "text-white/45 hover:text-white/80 hover:bg-white/5",
                ].join(" ")}
              >
                <Icon size={17} />
                {label}
                {label === "Orders" && (
                  <span className="ml-auto rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-violet-300">
                    3
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="border-t border-white/5 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
              JK
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">Jane Kim</p>
              <p className="truncate text-[11px] text-white/35">jane@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

// 1. Define the type for your keys
const PAGE_TITLES = {
  "/dashboard": "Overview",
  "/dashboard/products": "Products",
  "/dashboard/orders": "Orders",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings": "Settings",
};

// 2. Create a type helper based on the object keys
type PagePath = keyof typeof PAGE_TITLES;

interface TopbarProps {
  onMenuClick: () => void; // Fixed 'any' type here
}

function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();

  // 3. Type-cast or guard the pathname when indexing
  const title = PAGE_TITLES[pathname as PagePath] ?? "Dashboard";

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0d0d0d] px-5 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="text-white/50 hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <MenuIcon />
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

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a] font-sans antialiased">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}