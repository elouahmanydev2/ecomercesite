import { ProductStatus } from "@/generated/prisma/enums";
import z from "zod";

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  images: z.array(z.string().url()),
  thumbnail: z.coerce.number().int().min(0),

  // Use z.coerce to force string inputs from FormData into real numbers
  price: z.coerce.number().min(0, "Price must be a positive number"),
  sales: z.coerce.number().int().min(0, "Sales must be a positive integer"),
  stock: z.coerce.number().int(),

  status: z.nativeEnum(ProductStatus),
});

export type ProductType = z.infer<typeof ProductSchema>;
export type TopProductType = {
  name: string;
  revenue: number;
  sales: number;
  pct: number;
}