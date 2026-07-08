import { ProductStatus } from "@/generated/prisma/enums";
import { orderType } from "./orderType";
import z from "zod";

// export type ProductType ={
//  id: number;
//  name: string;
//  price: string;
//  sales?: number;
//  status: string;
//  images: string[];
// }

export const productSchema = z.object({
  id : z.string().optional(),
  name: z.string().min(1, "Name is required"),
  images: z.array(z.string().url()),
  price: z.number().min(0),
  sales: z.number().int().min(0),
  status: z.nativeEnum(ProductStatus),
});

export type ProductType = z.infer<typeof productSchema>;
export type TopProductType= {
 name: string;
 revenue: number;
 sales: number;
 pct: number;
}