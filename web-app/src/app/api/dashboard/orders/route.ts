import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { OrderSchema } from "@/types/orderType";
import { OrderStatus } from "@/generated/prisma/enums";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = OrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const order = await prisma.$transaction(async (tx) => {
      // Array to store validated items with guaranteed parent product IDs
      const validatedItems: Array<{
        productId: string;
        variantId?: string | null;
        quantity: number;
        priceCents: number;
      }> = [];

      // 1. Validate Stock & Retrieve Exact Parent Product IDs
      for (const item of data.items) {
        if (item.variantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
            include: { product: true },
          });

          if (!variant) {
            throw new Error(`Variant ${item.variantId} not found.`);
          }

          if (variant.stock < item.quantity) {
            throw new Error(
              `${variant.product.name} (${variant.title}) only has ${variant.stock} item(s) left.`
            );
          }

          validatedItems.push({
            productId: variant.productId, // 👈 ALWAYS use parent product ID from DB
            variantId: variant.id,
            quantity: item.quantity,
            priceCents: item.priceCents,
          });
        } else {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new Error(`Product ${item.productId} not found.`);
          }

          if (product.stock < item.quantity) {
            throw new Error(
              `${product.name} only has ${product.stock} item(s) left.`
            );
          }

          validatedItems.push({
            productId: product.id,
            variantId: null,
            quantity: item.quantity,
            priceCents: item.priceCents,
          });
        }
      }

      // 2. Create the Order header
      const createdOrder = await tx.order.create({
        data: {
          customer: data.customer,
          email: data.email ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
          amount: data.amount,
          status: data.status ?? OrderStatus.PENDING,
          note: data.note,
        },
      });

      // 3. Create items + update stock/sales using validated parent product IDs
      for (const item of validatedItems) {
        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId: item.productId, // 👈 Guaranteed to exist in 'products' table now
            variantId: item.variantId ?? null,
            quantity: item.quantity,
            priceCents: item.priceCents,
          },
        });

        // Deduct variant stock if variant exists
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        } else {
          // Fallback to base product stock deduction
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Always increment overall product sales counter
        await tx.product.update({
          where: { id: item.productId },
          data: {
            sales: {
              increment: item.quantity,
            },
          },
        });
      }

      // 4. Return complete created order
      return tx.order.findUnique({
        where: { id: createdOrder.id },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create order.",
      },
      { status: 500 }
    );
  }
}