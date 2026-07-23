// src/app/checkout/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { clearCart, selectCartItems, selectCartTotal } from "@/lib/features/cart/cartSlice";
import { createOrder } from "@/lib/features/orders/thunks/ordersThunks";


function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

type Step = "form" | "submitting" | "success";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  const [step, setStep] = useState<Step>("form");
  const {loading,error} = useAppSelector(s=>s.dashboard.orders)

  // ── Empty cart guard ──────────────────────────────────────────────────────
  if (items.length === 0 && step !== "success") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center font-sans antialiased">
        <span className="mb-4 text-5xl">🛒</span>
        <h2 className="mb-2 text-xl font-bold text-white">Your cart is empty</h2>
        <p className="mb-6 text-sm text-white/40">Add some products before checking out.</p>
        <Link
          href="/products"
          className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
        >
          Browse products
        </Link>
      </div>
    );
  }

  // ── Success state ─────────────────────────────────────────────────────────
  if (step === "success" && !loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center font-sans antialiased">
        <div className="mb-4 text-5xl">🎉</div>
        <h2 className="mb-2 text-2xl font-extrabold text-white">Order placed!</h2>
        <p className="mb-1 text-sm text-white/50">
          Thanks for your order. We'll be in touch shortly.
        </p>
        <p className="mb-8 text-xs text-white/25">Check your email for confirmation.</p>
        <Link
          href="/products"
          className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStep("submitting");

    const form = e.currentTarget;
    const customer = (form.elements.namedItem("customer") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const note = (form.elements.namedItem("note") as HTMLTextAreaElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const address = (form.elements.namedItem("address") as HTMLTextAreaElement).value;



    try {
      const result = await dispatch(
        createOrder({
          customer: customer,
          email: email,
          amount: total,
          status: "PENDING",
          items: items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            priceCents: Math.round(i.price * 100),
          })),
          phone: phone,
          address: address,
          note: note
        })
      );

      if (createOrder.fulfilled.match(result)) {
        dispatch(clearCart());
        setStep("success");
      }


      dispatch(clearCart());
    } catch (err) {
      setStep("form");
    }
  }

  // ── Main checkout UI ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans antialiased">

      {/* Top bar */}
      <div className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/products" className="text-sm text-white/40 hover:text-white transition-colors">
            ← Back to products
          </Link>
          <span className="text-base font-bold text-white">
            link<span className="text-violet-400">store</span>
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-5 py-12">
        <h1 className="mb-8 text-2xl font-extrabold tracking-tight text-white">Checkout</h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">

          {/* ── Left: form (3/5) ───────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">

            {/* Contact */}
            <div
              className="rounded-2xl border border-white/7 p-6 space-y-4"
              style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}
            >
              <h2 className="text-sm font-semibold text-white">Contact information</h2>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/50">
                  Full name <span className="text-red-400">*</span>
                </label>
                <input
                  name="customer"
                  required
                  placeholder="Jane Kim"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-violet-500/60 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/50">
                  Email address <span className="text-red-400">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-violet-500/60 focus:outline-none transition-colors"
                />
              </div>
              {/* phone */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/50">
                  Phone <span className="text-red-400">*</span>
                </label>
                <input
                  name="phone"
                  type="number"
                  required
                  placeholder="+123456789"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-violet-500/60 focus:outline-none transition-colors"
                />
              </div>
              {/* address */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/50">
                  Youe address <span className="text-red-400">*</span>
                </label>
                <input
                  name="address"
                  required
                  placeholder="casalanca ain dyab"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-violet-500/60 focus:outline-none transition-colors"
                />
              </div>
              {/* note */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/50">
                  Note <span className="text-white/25">(optional)</span>
                </label>
                <textarea
                  name="note"
                  rows={3}
                  placeholder="Any special instructions…"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-violet-500/60 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={step === "submitting"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-60 transition-colors"
            >
              {step === "submitting" ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Placing order…
                </>
              ) : (
                `Place order — ${formatPrice(total)}`
              )}
            </button>

            <p className="text-center text-xs text-white/20">
              No payment required — we'll contact you to confirm your order.
            </p>
          </form>

          {/* ── Right: order summary (2/5) ────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div
              className="sticky top-6 rounded-2xl border border-white/7 p-5"
              style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}
            >
              <h2 className="mb-4 text-sm font-semibold text-white">
                Order summary
                <span className="ml-2 text-white/30 font-normal">
                  ({items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""})
                </span>
              </h2>

              {/* Items */}
              <ul className="mb-5 space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5 text-xl">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : "📦"}
                    </div>

                    <div className="flex flex-1 justify-between gap-2 min-w-0">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-white">{item.name}</p>
                        <p className="text-[11px] text-white/35">qty {item.quantity}</p>
                      </div>
                      <p className="shrink-0 text-xs font-semibold text-white">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="mb-4 border-t border-white/8" />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/40">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-xs text-white/40">
                  <span>Shipping</span>
                  <span className="text-emerald-400">Free</span>
                </div>
                <div className="flex justify-between border-t border-white/8 pt-2 text-sm font-bold text-white">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}