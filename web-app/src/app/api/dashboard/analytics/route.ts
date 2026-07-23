import { NextResponse } from "next/server";
import { OrderStatus } from "@/generated/prisma/enums";
import { rangeQuerySchema } from "@/types/analytics";
import prisma from "@/lib/prisma";

// Helper to calculate date boundaries
function getDateRanges(range: "7D" | "30D" | "90D") {
  const now = new Date();
  const days = range === "7D" ? 7 : range === "30D" ? 30 : 90;

  const currentStart = new Date(now);
  currentStart.setDate(now.getDate() - days);

  const previousStart = new Date(currentStart);
  previousStart.setDate(currentStart.getDate() - days);

  return { currentStart, previousStart, now, days };
}

export async function GET(request: Request) {
  try {
    // 1. Security: Validate user authentication here (e.g., NextAuth/Clerk)
    // const session = await getServerSession();
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Validate URL Query Params with Zod
    const { searchParams } = new URL(request.url);
    const parsed = rangeQuerySchema.safeParse({
      range: searchParams.get("range") ?? "30D",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid range parameter", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { range } = parsed.data;
    const { currentStart, previousStart, now } = getDateRanges(range);

    // 3. Query Current Period Orders
    const currentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: currentStart, lte: now },
        status: { not: OrderStatus.CANCELLED },
      },
      select: {
        id: true,
        amount: true,
        createdAt: true,
      },
    });

    // 4. Query Previous Period Orders (For percentage calculations)
    const previousOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: previousStart, lt: currentStart },
        status: { not: OrderStatus.CANCELLED },
      },
      select: { amount: true },
    });

    // --- Compute Stat Summaries ---
    const currentRevenue = currentOrders.reduce((sum, o) => sum + o.amount, 0);
    const previousRevenue = previousOrders.reduce((sum, o) => sum + o.amount, 0);

    const currentOrderCount = currentOrders.length;
    const previousOrderCount = previousOrders.length;

    const currentAvg = currentOrderCount ? currentRevenue / currentOrderCount : 0;
    const previousAvg = previousOrderCount ? previousRevenue / previousOrderCount : 0;

    const calcChange = (curr: number, prev: number) =>
      prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);

    // --- Chart Data Bucket Aggregation ---
    const chartMap = new Map<string, { revenue: number; orders: number }>();

    currentOrders.forEach((order) => {
      // Group by Day (Jun 24) or Month depending on range
      const dateKey =
        range === "90D"
          ? order.createdAt.toLocaleDateString("en-US", { month: "short" })
          : order.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const existing = chartMap.get(dateKey) || { revenue: 0, orders: 0 };
      chartMap.set(dateKey, {
        revenue: existing.revenue + order.amount,
        orders: existing.orders + 1,
      });
    });

    const chartData = Array.from(chartMap.entries()).map(([date, val]) => ({
      date,
      revenue: Math.round(val.revenue),
      orders: val.orders,
    }));

    // --- Top Products Aggregation ---
    const topProductsRaw = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, priceCents: true },
      where: {
        order: {
          createdAt: { gte: currentStart },
          status: { not: OrderStatus.CANCELLED },
        },
      },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const productDetails = await prisma.product.findMany({
      where: { id: { in: topProductsRaw.map((p) => p.productId) } },
      select: { id: true, name: true },
    });

    const maxSales = Math.max(...topProductsRaw.map((p) => p._sum.quantity || 1));

    const topProducts = topProductsRaw.map((item) => {
      const prod = productDetails.find((p) => p.id === item.productId);
      const sales = item._sum.quantity || 0;
      const revenue = Math.round(((item._sum.priceCents || 0) * sales) / 100);

      return {
        id: item.productId,
        name: prod?.name || "Unknown Product",
        revenue,
        sales,
        pct: Math.round((sales / maxSales) * 100),
      };
    });

    return NextResponse.json({
      summary: {
        revenue: Math.round(currentRevenue),
        revenueChange: calcChange(currentRevenue, previousRevenue),
        orders: currentOrderCount,
        ordersChange: calcChange(currentOrderCount, previousOrderCount),
        avgOrderValue: Number(currentAvg.toFixed(2)),
        avgOrderValueChange: calcChange(currentAvg, previousAvg),
      },
      chartData,
      topProducts,
    });
  } catch (error) {
    console.error("[ANALYTICS_API_ERROR]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}