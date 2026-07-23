// src/app/products/page.tsx
// Public product listing — shows all ACTIVE products.
// Fetches directly from DB (Server Component).

'use client'
import { Navbar } from "@/components/global/Navbar";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchProducts } from "@/lib/features/products/thunks/productsThunks";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { useEffect } from "react";



function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function ProductsPage() {
    const dispatch = useAppDispatch()
  const {products,pending} = useAppSelector(s=>s.products)

  useEffect(()=>{
    dispatch(fetchProducts())
  },[dispatch])
  if (pending) return null
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans antialiased">

      {/* Header */}
         <nav>
           <Navbar />
         </nav>
         
      <main className="mx-auto max-w-4xl px-5 py-14">

        {/* Page title */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            All Products
          </h1>
          <p className="mt-2 text-sm text-white/40">
            {products.length} item{products.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Empty state */}
        {products.length === 0 && (
          <div className="rounded-2xl border border-white/7 py-24 text-center"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <p className="text-4xl mb-4">📦</p>
            <p className="text-sm text-white/40">No products available yet.</p>
          </div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const thumbnail = product.images?.[product.thumbnail] ?? null;

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group flex flex-col rounded-2xl border border-white/7 bg-white/2 overflow-hidden transition-all hover:border-violet-500/30 hover:bg-white/4"
                style={{
                  borderColor: "rgba(255,255,255,0.07)",
                  backgroundColor: "rgba(255,255,255,0.02)",
                }}
              >
                {/* Thumbnail */}
                <div className="relative flex h-44 items-center justify-center bg-white/4 overflow-hidden"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  {thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnail}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-5xl">📦</span>
                  )}

                  {/* Stock badge */}
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute top-2.5 right-2.5 rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                      Only {product.stock} left
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="absolute top-2.5 right-2.5 rounded-full bg-red-500/20 border border-red-500/30 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                      Sold out
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="mb-1 font-semibold text-white leading-snug">
                    {product.name}
                  </h2>
                  <p className="mb-4 text-xs text-white/35">
                    {product.sales} sold
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-bold text-white">
                      {formatPrice(product.price)}
                    </span>
                    <span className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-violet-700">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}