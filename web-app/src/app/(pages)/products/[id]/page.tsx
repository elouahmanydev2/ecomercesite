'use client'

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { fetchProduct } from "@/lib/store/features/product/thunks/productThunk";

const ProductContent = dynamic(() => import('@/components/product/ProductContent'), { ssr: true });

export default function ProductPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const id = params?.id as string;

  const { product, loading } = useAppSelector(s => s.user.product);

  useEffect(() => {
    // Only dispatch if id exists AND we aren't already loading or holding this product
    if (id && product?.id !== id && !loading) {
      dispatch(fetchProduct(id));
    }
  }, [id, dispatch, product?.id, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return <ProductContent product={product} />;
}