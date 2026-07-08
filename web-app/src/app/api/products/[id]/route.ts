import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";


// Zod Schema for PATCH (All fields are optional, but validated if provided)
const UpdateProductSchema = z.object({
  name: z.string().min(1).optional(),
  images: z.array(z.string().url()).optional(),
  price: z.number().positive().optional(),
  sales: z.number().int().nonnegative().optional(),
  status: z.enum(["Active", "Draft"]).optional(),
});

export async function GET(
  request: Request,
{ params }: { params: Promise<{ id: string }> }) {
  try {
     const {id} =  await params;
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const product = await prisma.product.findUnique({
      where:{id},
    })
    if (!product) {
      return NextResponse.json({ error: "No product found" }, { status: 404 });

    }
     return NextResponse.json(product, { status: 200 });

  } catch (error) {
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });

  }
}
// 3. UPDATE A PRODUCT (Secure/Protected)
export async function PATCH(
  request: Request,
{ params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔐 AUTHENTICATION GUARD PLACEHOLDER
    // if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const {id} =  await params;
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const validation = UpdateProductSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.format() }, { status: 400 });
    }

    // Verify product exists before updating
    const existingProduct = await prisma.product.findUnique({ where: { id: id } });
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: validation.data,
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// 4. DELETE A PRODUCT (Secure/Protected)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔐 AUTHENTICATION GUARD PLACEHOLDER
    // if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


    const {id} =  await params;
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }


    // Verify product exists
    const existingProduct = await prisma.product.findUnique({ where: { id: id } });
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}