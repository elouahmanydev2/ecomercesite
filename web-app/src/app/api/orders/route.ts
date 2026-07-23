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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);

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
      // Validate stock
      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: {
            id: item.productId,
          },
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

      // Create order
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

      // Create items + update products
      for (const item of data.items) {
        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            priceCents: item.priceCents,
          },
        });

        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
            sales: {
              increment: item.quantity,
            },
          },
        });
      }

      return tx.order.findUnique({
        where: {
          id: createdOrder.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);

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