// src/app/products/[id]/page.tsx
// Product detail page — OrderForm removed, AddToCartButton added.
'use client'
import AddToCartButton from "@/components/global/cart/AddToCartButton";
import { Navbar } from "@/components/global/Navbar";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchProduct } from "@/lib/features/product/thunks/productThunk";
import { ProductType } from "@/types/productType";
import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";



function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default  function ProductPage() {
  const dispatch=useAppDispatch()
  const {id} =useParams();
  const {product,loading} = useAppSelector(s=>s.product)

  useEffect(() => {
  if (id) {
    dispatch(fetchProduct(id as string));
  }
}, [dispatch, id]);

  const thumbnail  = product?.images?.[product.thumbnail] ?? null;
  const isSoldOut  = product?.stock === 0;

 if (loading) {
  return <div>Loading...</div>;
}

if (!product) {
  return (
    <div className="text-white p-10">
      Product is null
    </div>
  );
}

  return (
    <>
    <nav>
      <Navbar />
    </nav>

  <main>
    <div className="min-h-screen bg-[#0a0a0a] font-sans antialiased">
      {/* Top bar */}
      <div className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <a href="/products" className="text-sm text-white/40 hover:text-white transition-colors">
            ← All products
          </a>
          <p className="text-xs text-white/20">
            Powered by <span className="text-violet-400">linkstore</span>
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-5 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

          {/* Left — image */}
          <div>
            <div className="mb-4 flex h-80 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/7 bg-white/4"
              style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.04)" }}>
              {thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbnail} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-7xl">📦</span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <div key={i}
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border ${
                      i === product.thumbnail ? "border-violet-500" : "border-white/10"
                    }`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — info + add to cart */}
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl font-bold text-white">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-white/35">{product.sales} sold</span>
                {isSoldOut ? (
                  <span className="rounded-full bg-red-500/15 border border-red-500/25 px-2.5 py-0.5 text-xs font-medium text-red-400">Sold out</span>
                ) : product.stock <= 5 ? (
                  <span className="rounded-full bg-amber-500/15 border border-amber-500/25 px-2.5 py-0.5 text-xs font-medium text-amber-400">Only {product.stock} left</span>
                ) : (
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-0.5 text-xs font-medium text-emerald-400">In stock</span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 rounded-xl border border-white/7 p-4"
              style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}>
              <div className="flex-1 text-center">
                <p className="text-lg font-bold text-white">{product.sales}</p>
                <p className="text-xs text-white/35">Total sales</p>
              </div>
              <div className="w-px bg-white/8" />
              <div className="flex-1 text-center">
                <p className="text-lg font-bold text-white">{product.stock}</p>
                <p className="text-xs text-white/35">In stock</p>
              </div>
              <div className="w-px bg-white/8" />
              <div className="flex-1 text-center">
                <p className="text-lg font-bold text-white">{formatPrice(product.price * product.sales)}</p>
                <p className="text-xs text-white/35">Revenue</p>
              </div>
            </div>

            {/* Add to cart */}
            <AddToCartButton product={product} />
          </div>
        </div>
      </main>
    </div>
  </main>
    </>
  );
}