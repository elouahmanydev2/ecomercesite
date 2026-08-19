import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { OrderSchema } from "@/types/orderType";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// =========================
// GET ONE ORDER
// =========================
export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            variant:true
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch order." },
      { status: 500 }
    );
  }
}

// =========================
// UPDATE ORDER
// =========================
export async function PUT(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const parsed = OrderSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed.",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const exists = await prisma.order.findUnique({
      where: { id },
    });

    if (!exists) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        customer: parsed.data.customer,
        email: parsed.data.email,
        amount: parsed.data.amount,
        status: parsed.data.status,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to update order." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const parsed = OrderSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed.",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const exists = await prisma.order.findUnique({
      where: { id },
    });

    if (!exists) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {status:parsed.data.status},
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to update order." },
      { status: 500 }
    );
  }
}

// =========================
// DELETE ORDER
// =========================
export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const exists = await prisma.order.findUnique({
      where: { id },
    });

    if (!exists) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to delete order." },
      { status: 500 }
    );
  }
}