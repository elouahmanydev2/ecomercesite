'use client';

import AddToCartButton from "@/components/global/cart/AddToCartButton";
import { Navbar } from "@/components/global/Navbar";
import { ProductType } from "@/types/productType";
import { useMemo, useState } from "react";
import { TopBar } from "../global/TopBar";
import { ProductPreview } from "./ProductPreview";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

interface Props {
  product: ProductType;
}

export default function ProductContent({ product }: Props) {
  // Initialize option state with first available value for each option
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options?.forEach((opt) => {
      if (opt.values.length > 0) {
        initial[opt.name] = opt.values[0];
      }
    });
    return initial;
  });

  // Match active variant based on selected options
  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null;
    return (
      product.variants.find((variant) =>
        Object.entries(selectedOptions).every(
          ([optName, optVal]) => variant.options[optName] === optVal
        )
      ) ?? null
    );
  }, [product.variants, selectedOptions]);

  // Determine dynamic price, stock, and SKU based on selected variant or fallback to base product
  const currentPrice = selectedVariant?.price ?? product.price;
  const currentStock = selectedVariant?.stock ?? product.stock;
  const currentSku = selectedVariant?.sku;
  const isSoldOut = currentStock === 0;

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  return (
    <>
      <nav>
        <Navbar />
      </nav>

      <main className="min-h-screen bg-[#0a0a0a] font-sans antialiased">
        <TopBar />

        <div className="mx-auto max-w-4xl px-5 py-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Left — image */}
            <ProductPreview product={product} />

            {/* Right — info + add to cart */}
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-2xl font-bold text-white">
                    {formatPrice(currentPrice)}
                  </span>
                  <span className="text-sm text-white/35">
                    {product.sales} sold
                  </span>
                  {isSoldOut ? (
                    <span className="rounded-full bg-red-500/15 border border-red-500/25 px-2.5 py-0.5 text-xs font-medium text-red-400">
                      Sold out
                    </span>
                  ) : currentStock <= 5 ? (
                    <span className="rounded-full bg-amber-500/15 border border-amber-500/25 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                      Only {currentStock} left
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      In stock
                    </span>
                  )}
                </div>
              </div>

              {/* Options Selector (Sizes, Colors, etc.) */}
              {product.options && product.options.length > 0 && (
                <div className="flex flex-col gap-4 border-t border-white/10 pt-4">
                  {product.options.map((option) => (
                    <div key={option.name || option.id} className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                        {option.name}:{" "}
                        <span className="text-white font-medium">
                          {selectedOptions[option.name]}
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((val) => {
                          const isSelected = selectedOptions[option.name] === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleOptionSelect(option.name, val)}
                              className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors border ${
                                isSelected
                                  ? "bg-white text-black border-white"
                                  : "bg-white/5 text-white/80 border-white/10 hover:border-white/30 hover:bg-white/10"
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SKU display */}
              {currentSku && (
                <div className="text-xs text-white/40 font-mono">
                  SKU: {currentSku}
                </div>
              )}

              {/* Add to cart */}
              <AddToCartButton
                product={product}
                selectedVariant={selectedVariant}
                selectedOptions={selectedOptions}
                disabled={isSoldOut}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}