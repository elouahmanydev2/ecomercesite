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
            variant: true, // Included variant details
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
      // 1. Validate Stock (Product or Variant level)
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

      // 3. Create items + update stock/sales
      for (const item of data.items) {
        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId: item.productId,
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
          // Fallback to product stock deduction
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Always increment overall product sales
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