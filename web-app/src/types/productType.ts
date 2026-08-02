import { ProductStatus } from "@/generated/prisma/enums";
import z from "zod";

export const ProductOptionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Option name required"), // e.g. "Size"
  values: z.array(z.string()),                     // e.g. ["S", "M", "L"]
});

export const ProductVariantSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  sku: z.string().optional().nullable(),
  price: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().default(0),
  options: z.record(z.string(), z.string()), // { "Size": "M", "Color": "Blue" }
});

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  images: z.array(z.string()), // Removed strictly requiring http(s) URL
  thumbnail: z.coerce.number().int().min(0),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  sales: z.coerce.number().int().min(0, "Sales must be a positive integer"),
  stock: z.coerce.number().int(),
  status: z.nativeEnum(ProductStatus),

  options: z.array(ProductOptionSchema).optional(),
  variants: z.array(ProductVariantSchema).optional(),
});

export type ProductOptionType = z.infer<typeof ProductOptionSchema>;
export type ProductVariantType = z.infer<typeof ProductVariantSchema>;
export type ProductType = z.infer<typeof ProductSchema>;
export type TopProductType = {
  name: string;
  revenue: number;
  sales: number;
  pct: number;
}