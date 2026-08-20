// src/components/cart/CartDrawer.tsx
"use client";

import Link from "next/link";
import {
  selectCartItems,
  selectCartTotal,
  selectIsDrawerOpen,
  closeDrawer,
  removeItem,
  incrementItem,
  decrementItem,
} from "@/lib/store/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2 4h11M5 4V2.5h5V4M6 7v5M9 7v5M3 4l1 9h7l1-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const isOpen = useAppSelector(selectIsDrawerOpen);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => dispatch(closeDrawer())}
        />
      )}

      {/* Drawer panel */}
      <div
        className={[
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-[#111] shadow-2xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white">Cart</h2>
            {items.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={() => dispatch(closeDrawer())}
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Empty state */}
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="mb-4 text-5xl">🛒</span>
              <p className="text-sm font-medium text-white/50">Your cart is empty</p>
              <button
                onClick={() => dispatch(closeDrawer())}
                className="mt-4 text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                Browse products →
              </button>
            </div>
          )}

          {/* Items */}
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex gap-4 rounded-xl border border-white/7 p-3"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
              >
                {/* Thumbnail */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5 text-2xl">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    "📦"
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col items-start">
                      <p className="truncate text-sm font-medium text-white">{item.name}</p>
                      {item.variantTitle && (
                        <p className="text-xs text-white/40 truncate">{item.variantTitle}</p>
                      )}
                    </div>

                    <button
                      onClick={() => dispatch(removeItem(item.id))}
                      className="shrink-0 text-white/25 hover:text-red-400 transition-colors"
                      aria-label="Remove item"
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Qty controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(decrementItem(item.id))}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-xs font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(incrementItem(item.id))}
                        disabled={item.quantity >= item.stock}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer — only when cart has items */}
        {items.length > 0 && (
          <div className="border-t border-white/8 px-5 py-5 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Subtotal</span>
              <span className="text-base font-bold text-white">{formatPrice(total)}</span>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              onClick={() => dispatch(closeDrawer())}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-bold text-white hover:bg-violet-700 transition-colors"
            >
              Checkout — {formatPrice(total)}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <p className="text-center text-[11px] text-white/20">
              Free to order — no payment required now
            </p>
          </div>
        )}
      </div>
    </>
  );
}