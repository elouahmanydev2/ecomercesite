"use client";

import { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setAddProductModal } from "@/lib/features/modals/modalSlice";
import { fetchProducts } from "@/lib/features/products/thunks/productsThunks";
import ProductModal from "@/components/modals/ProductModal";


// ───Products Content ─────────────────────────────────────────────────────────────────────

export default function ProductsContent() {
  const [filter, setFilter] = useState("All");
  const { isAddProductModalOpen } = useAppSelector(s => s.modal)
  const dispatch = useAppDispatch();
  const { products, pending, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (pending) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  const filtered = filter === "All" ? products : products.filter((p) => p.status === filter);

  return (
    <div className="max-w-5xl space-y-6">
      {isAddProductModalOpen && <ProductModal
        onClose={() => dispatch(setAddProductModal(false))}/>}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Products</h2>
          <p className="mt-0.5 text-sm text-white/40">{products.length} products in your store</p>
        </div>
        <button
          onClick={() => dispatch(setAddProductModal(true))}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          Add product
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 border-b border-white/5 pb-0">
        {["All", "Active", "Draft"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
              filter === f
                ? "border-violet-500 text-violet-400"
                : "border-transparent text-white/40 hover:text-white/70",
            ].join(" ")}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Product list */}
      <div className="overflow-hidden rounded-xl border border-white/7" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-4 py-3 text-left text-xs font-medium text-white/30">Product</th>
              <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-white/30">Price</th>
              <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-white/30">Sales</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/30">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-white/30">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (

              <ProductItem
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                sales={p.sales}
                status={p.status}
                images={p.images} 
                thumbnail={p.thumbnail} 
                stock={p.stock} 
                />
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-white/30">No {filter.toLowerCase()} products yet.</p>
            <button onClick={() => dispatch(setAddProductModal(true))} className="mt-3 dispatch(setAddProductModal(false))text-xs text-violet-400 hover:text-violet-300 transition-colors">
              Add your first product →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}