"use client";
import { useParams} from "next/navigation";
import EditProductContent from "@/components/dashboard/product/EditProductContent";

export default function EditProductPage() {
   const { id } = useParams<{ id: string }>();

  return (
   <>
   <EditProductContent id={id} />
   </>
  );
}