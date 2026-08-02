import { OrderStatus } from "@/generated/prisma/enums";
import { z } from "zod";


export const OrderItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, "Product is required"),
  variantId: z.string().optional().nullable(), // 👈 ADD THIS FIELD

  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  priceCents: z.coerce.number().int().min(0),
  // Product relation — returned by the API via include
  product: z
    .object({
      id: z.string(),
      name: z.string(),
      images: z.array(z.string()),
      thumbnail: z.number(),
    })
    .optional(),
});


export const OrderSchema = z.object({
  id: z.string().optional(),
  customer: z.string().min(1, "Customer name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  amount: z.coerce.number().min(0),
  status: z.nativeEnum(OrderStatus).optional(),
  note: z.string().optional(),
  items: z.array(OrderItemSchema).min(1, "Order must contain at least one item"),
});

export type OrderItemType = z.infer<typeof OrderItemSchema>;
export type OrderType = z.infer<typeof OrderSchema>;