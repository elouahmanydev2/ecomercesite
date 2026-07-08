import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import z from "zod";


// Zod Schema to validate incoming POST request data
const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  images: z.array(z.string().url("Each image must be a valid URL")),
  price: z.number().positive("Price must be a positive number"),
  sales: z.number().int().nonnegative("Sales must be a non-negative integer"),
  status: z.enum(["Active", "Draft"]).optional(),
});

// 1. GET ALL PRODUCTS (Public or Private depending on your needs)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// 2. CREATE A PRODUCT (Secure/Protected)
export async function POST(request: Request) {
  try {
    // 🔐 AUTHENTICATION GUARD PLACEHOLDER
    // const session = await auth(); if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    
    // Validate the input data against the schema (Prevents SQL injection/bad data)
    const validation = CreateProductSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.format() }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: validation.data,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}