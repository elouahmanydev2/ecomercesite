// src/components/cart/CartButton.tsx
// Drop this in your navbar/header to open the cart drawer.
"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectCartCount, toggleDrawer } from "@/lib/store/features/cart/cartSlice";


export default function CartButton() {
  const dispatch = useAppDispatch();
  const count    = useAppSelector(selectCartCount);

  return (
    <button
      onClick={() => dispatch(toggleDrawer())}
      aria-label="Open cart"
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
    >
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M1.5 1.5h2l1.8 8.5h7.4l1.5-6H4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7.5" cy="13.5" r="1" fill="currentColor" />
        <circle cx="12.5" cy="13.5" r="1" fill="currentColor" />
      </svg>

      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[9px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}