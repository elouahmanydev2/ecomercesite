// src/types/orderType.ts
import { OrderStatus } from "@/generated/prisma/enums";
import { z } from "zod";

export const OrderItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, "Product is required"),
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
  // Present on orders returned from the DB, optional when creating
  id: z.string().optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),

  customer: z.string().trim().min(2, "Customer name is required"),

  email: z.string().email("Invalid email address").optional().or(z.literal("")),

  phone: z.string().optional().or(z.literal("")),

  address: z.string().optional().or(z.literal("")),

  amount: z.coerce.number().min(0),

  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),

  note: z.string().optional(),

  items: z.array(OrderItemSchema).min(1, "Order must contain at least one item"),
});

export type OrderType = z.infer<typeof OrderSchema>;
export type OrderItemType = z.infer<typeof OrderItemSchema>;