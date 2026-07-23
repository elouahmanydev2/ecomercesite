// src/app/products/[id]/OrderForm.tsx
"use client";

import { ProductType } from "@/types/productType";
import { useState } from "react";


type Step = "form" | "submitting" | "success" | "error";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}

export default function OrderForm({
  product,
  isSoldOut,
}: {
  product: ProductType;
  isSoldOut: boolean;
}) {
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStep("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = {
      productId: product.id,
      customer: (form.elements.namedItem("customer") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      quantity,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? "Something went wrong");

      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("error");
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center">
        <div className="mb-4 text-5xl">🎉</div>
        <h3 className="mb-1 text-lg font-bold text-white">Order placed!</h3>
        <p className="mb-6 text-sm text-white/45">
          We've received your order and will be in touch shortly.
        </p>
        <a
          href="/products"
          className="rounded-xl bg-white/8 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/12 transition-colors"
          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        >
          Browse more products
        </a>
      </div>
    );
  }

  // ── Main form ──────────────────────────────────────────────────────────────
  return (
    <div
      className="rounded-2xl border border-white/7 p-6"
      style={{
        borderColor: "rgba(255,255,255,0.07)",
        backgroundColor: "rgba(255,255,255,0.02)",
      }}
    >
      <h2 className="mb-1 text-base font-semibold text-white">Place your order</h2>
      <p className="mb-6 text-xs text-white/35">
        Fill in your details and we'll confirm your order.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/50">
            Full name
          </label>
          <input
            name="customer"
            required
            placeholder="Jane Kim"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-violet-500/60 focus:outline-none transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/50">
            Email address
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="jane@example.com"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-violet-500/60 focus:outline-none transition-colors"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/50">
            Quantity
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors text-lg font-medium"
            >
              −
            </button>
            <span className="min-w-[2rem] text-center text-sm font-semibold text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                setQuantity((q) => Math.min(product.stock, q + 1))
              }
              disabled={quantity >= product.stock}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 transition-colors text-lg font-medium"
            >
              +
            </button>
            <span className="text-xs text-white/30">
              {product.stock} available
            </span>
          </div>
        </div>

        {/* Order summary */}
        <div
          className="rounded-xl border border-white/8 p-4"
          style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.03)" }}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/50">
              {product.name} × {quantity}
            </span>
            <span className="font-semibold text-white">
              {formatPrice(product.price * quantity)}
            </span>
          </div>
        </div>

        {/* Error */}
        {step === "error" && error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSoldOut || step === "submitting"}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
        >
          {step === "submitting" ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Placing order…
            </>
          ) : isSoldOut ? (
            "Sold out"
          ) : (
            `Order for ${formatPrice(product.price * quantity)}`
          )}
        </button>

        <p className="text-center text-[11px] text-white/20">
          No payment required now — we'll contact you to confirm.
        </p>
      </form>
    </div>
  );
}