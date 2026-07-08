import { OrderStatus } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const newOrderCount = await prisma.order.count({
      where: {
        status: OrderStatus.PENDING,
      },
    });

    return NextResponse.json(newOrderCount);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}