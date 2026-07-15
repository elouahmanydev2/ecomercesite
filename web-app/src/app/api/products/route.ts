import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { ProductSchema } from "@/types/productType";
import { NextResponse } from "next/server";

// GET ALL PRODUCTS (Public or Private depending on your needs)
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

// CREATE A PRODUCT (Secure/Protected)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const price = formData.get("price");
    const stock = formData.get("stock");
    const status = formData.get("status"); // Leave it as a raw string ("Draft" or "Active")
    const files = formData.getAll("files") as File[];


    if (!files || files.length === 0) {
      return NextResponse.json({ errors: "No images provided" }, { status: 400 });
    }

    // 1. Uploading images
    const urls = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!.secure_url);
            }
          );
          uploadStream.end(buffer);
        });
      })
    );
    // Validate with Zod
    const validation = ProductSchema.safeParse({
      name,
      price,
      stock,
      status,
      images: urls,
      thumbnail: 0,
      sales: 0
    });

    // CRITICAL: If validation fails, log it to terminal so you see EXACTLY which field broke
    if (!validation.success) {
      console.error("❌ ZOD VALIDATION FAILED:", validation.error.flatten());
      return NextResponse.json({ errors: validation.error.format() }, { status: 400 });
    }

    // 3. Create product in DB
    const newProduct = await prisma.product.create({
      data: validation.data,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}