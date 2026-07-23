import prisma from "@/lib/prisma";
import { OrderStatus } from "@/generated/prisma/enums";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [revenue, orderCount, productCount, recentOrders] =
      await Promise.all([
        prisma.order.aggregate({
          where: {
            status: OrderStatus.PAID,
          },
          _sum: {
            amount: true,
          },
        }),

        prisma.order.count(),

        prisma.product.count(),

        prisma.order.findMany({
          take: 6,
          where:{status:OrderStatus.PENDING},
          orderBy: {
            createdAt: "desc",
          },
          include: {
            items:{
              include:{
                product:true
              }
            }
          },
        }),
      ]);

    return NextResponse.json({
      revenue: revenue._sum.amount ?? 0,
      orderCount,
      productCount,
      recentOrders,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard" },
      { status: 500 }
    );
  }
}