"use client";

import { ProductVariantType } from "@/types/productType";

interface VariantsBuilderProps {
  variants: ProductVariantType[];
  inputClass: string;
  labelClass: string;
  updateVariant: (
    index: number,
    field: "sku" | "price" | "stock",
    value: string
  ) => void;
  removeVariant: (index: number) => void;
}

export default function VariantsBuilder({
  variants,
  inputClass,
  labelClass,
  updateVariant,
  removeVariant,
}: VariantsBuilderProps) {
  return (
    <section className="space-y-4">
      <h2 className="border-b border-zinc-800 pb-2 text-base font-semibold text-zinc-300">
        Generated Variants ({variants.length})
      </h2>

      <div className="max-h-[480px] space-y-4 overflow-y-auto pr-1">
        {variants.map((variant, index) => (
          <div
            key={index}
            className="relative space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-zinc-100">
                {variant.title || `Variant #${index + 1}`}
              </span>

              <div className="flex items-center gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(variant.options).map(([key, value]) => (
                    <span
                      key={key}
                      className="rounded border border-zinc-700/50 bg-zinc-800/60 px-2 py-0.5 text-xs font-medium text-zinc-300"
                    >
                      {key}: {value}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="rounded-md border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* SKU */}
              <div>
                <label className={labelClass}>SKU</label>

                <input
                  type="text"
                  value={variant.sku || ""}
                  placeholder="SKU"
                  onChange={(e) =>
                    updateVariant(index, "sku", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {/* Price */}
              <div>
                <label className={labelClass}>Price ($)</label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={variant.price ?? 0}
                  onChange={(e) =>
                    updateVariant(index, "price", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {/* Stock */}
              <div>
                <label className={labelClass}>Stock</label>

                <input
                  type="number"
                  min="0"
                  value={variant.stock ?? 0}
                  onChange={(e) =>
                    updateVariant(index, "stock", e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}