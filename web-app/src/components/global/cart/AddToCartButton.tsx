// src/components/cart/AddToCartButton.tsx
// Drop this on the product page instead of OrderForm.
"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { addItem, selectItemById } from "@/lib/features/cart/cartSlice";
import { ProductType } from "@/types/productType";
import { useState } from "react";


type Props = {
  product: ProductType;
};

export default function AddToCartButton({ product }: Props) {
  const dispatch    = useAppDispatch();
  const cartItem    = useAppSelector(selectItemById(product.id as string));
  const [added, setAdded] = useState(false);

  const isSoldOut   = product.stock === 0;
  const isMaxed     = cartItem ? cartItem.quantity >= product.stock : false;
  const image       = product.images?.[product.thumbnail] ?? null;

  function handleAdd() {
    dispatch(
      addItem({
        id: product.id as string,
        name: product.name,
        price: product.price,
        stock: product.stock,
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
              <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Added to cart!
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M1.5 1.5h2l1.6 7.5h6.6l1.3-5.5H4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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