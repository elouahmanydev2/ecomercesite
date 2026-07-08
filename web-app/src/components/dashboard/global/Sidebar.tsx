import { BoxIcon, ChartIcon, CloseIcon, GearIcon, HomeIcon, LinkIcon, ReceiptIcon } from "@/components/icons";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchNewOrderCount } from "@/lib/features/orders/thunks/ordersThunks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { NavSideItem } from "./NavSideItem";

const NAV = [
  { label: "Overview",  href: "/dashboard",           icon: HomeIcon },
  { label: "Products",  href: "/dashboard/products",  icon: BoxIcon },
  { label: "Orders",    href: "/dashboard/orders",    icon: ReceiptIcon },
  { label: "Analytics", href: "/dashboard/analytics", icon: ChartIcon },
  { label: "Settings",  href: "/dashboard/settings",  icon: GearIcon },
];

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export function Sidebar({ open, onClose }:any) {
    const dispatch = useAppDispatch()
    const {countLoading ,newOrdersCount} = useAppSelector(state => state.dashboard.orders);
  const pathname = usePathname();

  useEffect(()=>{
    dispatch(fetchNewOrderCount())
  },[dispatch])
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
            <CloseIcon size={14}/>
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
              <NavSideItem 
              key={href}
              href={href} 
              active={active} 
              Icon={Icon} 
              label={label} 
              pending={countLoading} 
              newOrdersCount={newOrdersCount ?? 0} 
              onClose={onClose} />
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