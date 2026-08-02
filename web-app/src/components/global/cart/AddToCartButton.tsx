// src/components/cart/AddToCartButton.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { addItem, selectItemById } from "@/lib/features/cart/cartSlice";
import { ProductType } from "@/types/productType";
import { useState } from "react";

type Props = {
  product: ProductType;
  selectedVariant?: {
    id: string;
    title: string;
    price?: number | null;
    stock: number;
  };
};

export default function AddToCartButton({ product, selectedVariant }: Props) {
  const dispatch = useAppDispatch();

  // 1. Determine unique cart Item ID (combine product ID + variant ID if available)
  const productId = product.id as string;
  const cartItemId = selectedVariant ? `${productId}-${selectedVariant.id}` : productId;

  const cartItem = useAppSelector(selectItemById(cartItemId));
  const [added, setAdded] = useState(false);

  // 2. Use variant stock & price if available, otherwise fallback to base product
  const effectiveStock = selectedVariant ? selectedVariant.stock : product.stock;
  const effectivePrice = selectedVariant?.price ?? product.price;

  const isSoldOut = effectiveStock === 0;
  const isMaxed = cartItem ? cartItem.quantity >= effectiveStock : false;
  const image = product.images?.[product.thumbnail] ?? product.images?.[0] ?? null;

  function handleAdd() {
    dispatch(
      addItem({
        id: cartItemId,              // Unique line-item ID for Redux
        productId: productId,        // 👈 Explicit Product ID for backend orders
        variantId: selectedVariant?.id,
        variantTitle: selectedVariant?.title,
        name: product.name,
        price: effectivePrice,
        stock: effectiveStock,
        image,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleAdd}
        disabled={isSoldOut || isMaxed}
        className={[
          "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all duration-150",
          isSoldOut || isMaxed
            ? "bg-white/10 text-white/30 cursor-not-allowed"
            : added
            ? "bg-emerald-600 text-white"
            : "bg-violet-600 text-white hover:bg-violet-700",
        ].join(" ")}
      >
        {isSoldOut ? (
          "Sold out"
        ) : isMaxed ? (
          "Max quantity in cart"
        ) : added ? (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2.5 7l3 3 6-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Added to cart!
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M1.5 1.5h2l1.6 7.5h6.6l1.3-5.5H4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="6.5" cy="12" r="1" fill="currentColor" />
              <circle cx="11" cy="12" r="1" fill="currentColor" />
            </svg>
            Add to cart
          </>
        )}
      </button>

      {cartItem && (
        <p className="text-center text-xs text-white/35">
          {cartItem.quantity} in cart
        </p>
      )}
    </div>
  );
}