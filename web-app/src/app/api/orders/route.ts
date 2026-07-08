// Zod Schema to validate incoming POST request data

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

 

// 1. GET ALL ORDERS
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include:{
        product:true
      }
    });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
