import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { ProductSchema } from "@/types/productType";
import { NextResponse } from "next/server";
import { z } from "zod";


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
//UPDATE A PRODUCT
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
    const validation = ProductSchema.safeParse(body);
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


// CREATE A PRODUCT (Secure/Protected)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    // 1. Fetch the current product to preserve unchanged fields (like sales)
    const currentProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!currentProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const name = formData.get("name") as string;
    const price = formData.get("price");
    const stock = Number(formData.get("stock") ?? 0);
    const status = formData.get("status");
    const thumbnailIndex = formData.get("thumbnailIndex");

    // Get existing images sent back from frontend
    const existingImagesStr = formData.get("existingImages") as string;
    const existingImages: string[] = existingImagesStr 
      ? JSON.parse(existingImagesStr) 
      : [];

    // Get any newly uploaded files
    const newFiles = formData.getAll("files") as File[];

    // Upload only the NEW files to Cloudinary
    const uploadedUrls = await Promise.all(
      newFiles.map(async (file) => {
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

    const finalImages = [...existingImages, ...uploadedUrls];

    if (finalImages.length === 0) {
      return NextResponse.json({ errors: "At least one image is required" }, { status: 400 });
    }

    // 4. Map the thumbnail index to the combined array

    // 5. Validate with Zod (passing current sales so it's not wiped out)
    const validation = ProductSchema.safeParse({
      id,
      name,
      price,
      stock,
      status,
      images: finalImages,
      thumbnail: thumbnailIndex,
      sales: currentProduct.sales, // Keep the existing sales count!
    });

    if (!validation.success) {
      console.error("❌ ZOD VALIDATION FAILED:", validation.error.flatten());
      return NextResponse.json({ errors: validation.error.format() }, { status: 400 });
    }

    // 6. Update product in DB
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
//DELETE A PRODUCT (Secure/Protected)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

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