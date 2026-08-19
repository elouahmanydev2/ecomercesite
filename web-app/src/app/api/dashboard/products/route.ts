import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { ProductSchema } from "@/types/productType";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        options: true,
        variants: true,
      },
    });

    return NextResponse.json(products, {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch products",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // ==========================================
    // 1. GET BASIC PRODUCT DATA
    // ==========================================

    const name = String(formData.get("name") ?? "").trim();

    const priceValue = formData.get("price");
    const stockValue = formData.get("stock");
    const thumbnailValue = formData.get("thumbnailIndex");
    const status = String(formData.get("status") ?? "");

    const price = Number(priceValue ?? 0);
    const stock = Number(stockValue ?? 0);
    const thumbnail = Number(thumbnailValue ?? 0);

    // ==========================================
    // 2. GET IMAGES
    // ==========================================

    const files = formData
      .getAll("files")
      .filter((file): file is File => file instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        {
          error: "No images provided",
        },
        {
          status: 400,
        }
      );
    }

    if (files.length > 5) {
      return NextResponse.json(
        {
          error: "You can upload a maximum of 5 images.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // 3. PARSE OPTIONS
    // ==========================================

    const optionsRaw = formData.get("options");

    let options: unknown[] = [];

    if (optionsRaw) {
      try {
        const parsedOptions = JSON.parse(String(optionsRaw));

        if (!Array.isArray(parsedOptions)) {
          return NextResponse.json(
            {
              error: "Options must be an array.",
            },
            {
              status: 400,
            }
          );
        }

        options = parsedOptions;
      } catch (error) {
        console.error("Options JSON parse error:", error);

        return NextResponse.json(
          {
            error: "Invalid options format.",
          },
          {
            status: 400,
          }
        );
      }
    }

    // ==========================================
    // 4. PARSE VARIANTS
    // ==========================================

    const variantsRaw = formData.get("variants");

    let variants: unknown[] = [];

    if (variantsRaw) {
      try {
        const parsedVariants = JSON.parse(String(variantsRaw));

        if (!Array.isArray(parsedVariants)) {
          return NextResponse.json(
            {
              error: "Variants must be an array.",
            },
            {
              status: 400,
            }
          );
        }

        variants = parsedVariants;
      } catch (error) {
        console.error("Variants JSON parse error:", error);

        return NextResponse.json(
          {
            error: "Invalid variants format.",
          },
          {
            status: 400,
          }
        );
      }
    }

    // ==========================================
    // 5. VALIDATE PRODUCT BEFORE UPLOAD
    // ==========================================

    const validation = ProductSchema.safeParse({
      name,
      price,
      stock,
      status,
      images: [],
      thumbnail,
      sales: 0,
      options,
      variants,
    });

    if (!validation.success) {
      const formattedErrors = validation.error.format();

      console.error(
        "❌ ZOD VALIDATION FAILED:",
        JSON.stringify(formattedErrors, null, 2)
      );

      return NextResponse.json(
        {
          error: "Product validation failed.",
          errors: formattedErrors,
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // 6. UPLOAD IMAGES TO CLOUDINARY
    // ==========================================

    const urls = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());

        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "products",
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                reject(error);
                return;
              }

              if (!result?.secure_url) {
                reject(new Error("Cloudinary did not return a secure URL."));
                return;
              }

              resolve(result.secure_url);
            }
          );

          uploadStream.end(buffer);
        });
      })
    );

    // ==========================================
    // 7. VALIDATE AGAIN WITH REAL IMAGE URLS
    // ==========================================

    const finalValidation = ProductSchema.safeParse({
      ...validation.data,
      images: urls,
    });

    if (!finalValidation.success) {
      console.error(
        "❌ FINAL ZOD VALIDATION FAILED:",
        finalValidation.error.format()
      );

      return NextResponse.json(
        {
          error: "Product validation failed.",
          errors: finalValidation.error.format(),
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // 8. SEPARATE RELATIONAL DATA
    // ==========================================

    const {
      options: validatedOptions,
      variants: validatedVariants,
      id,
      ...productData
    } = finalValidation.data;

    // ==========================================
    // 9. CREATE PRODUCT
    // ==========================================

    const newProduct = await prisma.product.create({
      data: {
        ...productData,

        options: {
          create:
            validatedOptions?.map((option) => ({
              name: option.name,
              values: option.values,
            })) ?? [],
        },

        variants: {
          create:
            validatedVariants?.map((variant) => ({
              title: variant.title,
              sku: variant.sku ?? null,
              price: variant.price ?? null,
              stock: variant.stock,
              options: variant.options,
            })) ?? [],
        },
      },

      include: {
        options: true,
        variants: true,
      },
    });

    // ==========================================
    // 10. RETURN CREATED PRODUCT
    // ==========================================

    return NextResponse.json(newProduct, {
      status: 201,
    });
  } catch (error) {
    console.error("❌ Product creation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while creating the product.",
      },
      {
        status: 500,
      }
    );
  }
}