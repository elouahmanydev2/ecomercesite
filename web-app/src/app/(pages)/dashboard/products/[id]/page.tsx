"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { deleteProduct, fetchProduct, updateProduct } from "@/lib/features/product/thunks/productThunk";
import EditProductContent from "@/components/dashboard/products/EditProductContent";

type ImageItem =
  | { type: "existing"; url: string }
  | { type: "new"; file: File; previewUrl: string };

export default function EditProductPage() {
   const { id } = useParams<{ id: string }>();

  return (
   <>
   <EditProductContent id={id} />
   </>
  );
}