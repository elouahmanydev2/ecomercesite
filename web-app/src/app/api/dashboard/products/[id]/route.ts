import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { deleteImages } from "@/lib/utils/deleteImages";
import { ProductSchema } from "@/types/productType";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/* ==========================================
   GET ONE PRODUCT
========================================== */

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        options: true,
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(product, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "❌ Failed to fetch product:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch product",
      },
      {
        status: 500,
      }
    );
  }
}

/* ==========================================
   UPDATE PRODUCT
========================================== */

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    // ========================================
    // 1. FIND EXISTING PRODUCT
    // ========================================

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id,
        },
        include: {
          options: true,
          variants: true,
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    // ========================================
    // 2. READ FORM DATA
    // ========================================

    const formData = await request.formData();

    const name = String(
      formData.get("name") ?? ""
    ).trim();

    const price = Number(
      formData.get("price") ?? 0
    );

    const stock = Number(
      formData.get("stock") ?? 0
    );

    const status = String(
      formData.get("status") ?? ""
    );

    const thumbnailIndex = Number(
      formData.get("thumbnailIndex") ?? 0
    );

    // ========================================
    // 3. GET EXISTING IMAGES
    // ========================================

    const existingImagesRaw =
      formData.get("existingImages");

    let existingImages: string[] = [];

    if (existingImagesRaw) {
      try {
        const parsed =
          JSON.parse(
            String(existingImagesRaw)
          );

        if (Array.isArray(parsed)) {
          existingImages = parsed.filter(
            (image): image is string =>
              typeof image === "string"
          );
        }
      } catch (error) {
        return NextResponse.json(
          {
            error:
              "Invalid existing images format",
          },
          {
            status: 400,
          }
        );
      }
    }

    // ========================================
    // 4. GET NEW IMAGE FILES
    // ========================================

    const files = formData
      .getAll("files")
      .filter(
        (file): file is File =>
          file instanceof File &&
          file.size > 0
      );

    // ========================================
    // 5. MAXIMUM 5 IMAGES
    // ========================================

    if (
      existingImages.length +
      files.length >
      5
    ) {
      return NextResponse.json(
        {
          error:
            "You can have a maximum of 5 images.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      existingImages.length === 0 &&
      files.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Product must have at least one image.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // 6. PARSE OPTIONS
    // ========================================

    const optionsRaw =
      formData.get("options");

    let options: unknown[] = [];

    if (optionsRaw) {
      try {
        const parsed =
          JSON.parse(
            String(optionsRaw)
          );

        if (!Array.isArray(parsed)) {
          return NextResponse.json(
            {
              error:
                "Options must be an array.",
            },
            {
              status: 400,
            }
          );
        }

        options = parsed;
      } catch (error) {
        return NextResponse.json(
          {
            error:
              "Invalid options format.",
          },
          {
            status: 400,
          }
        );
      }
    }

    // ========================================
    // 7. PARSE VARIANTS
    // ========================================

    const variantsRaw =
      formData.get("variants");

    let variants: unknown[] = [];

    if (variantsRaw) {
      try {
        const parsed =
          JSON.parse(
            String(variantsRaw)
          );

        if (!Array.isArray(parsed)) {
          return NextResponse.json(
            {
              error:
                "Variants must be an array.",
            },
            {
              status: 400,
            }
          );
        }

        variants = parsed;
      } catch (error) {
        return NextResponse.json(
          {
            error:
              "Invalid variants format.",
          },
          {
            status: 400,
          }
        );
      }
    }

    // ========================================
    // 8. UPLOAD NEW IMAGES
    // ========================================

    const newImageUrls =
      await Promise.all(
        files.map(async (file) => {
          const buffer = Buffer.from(
            await file.arrayBuffer()
          );

          return new Promise<string>(
            (resolve, reject) => {
              const uploadStream =
                cloudinary.uploader.upload_stream(
                  {
                    folder: "products",
                    resource_type: "image",
                  },
                  (
                    error,
                    result
                  ) => {
                    if (error) {
                      reject(error);
                      return;
                    }

                    if (
                      !result?.secure_url
                    ) {
                      reject(
                        new Error(
                          "Cloudinary did not return a secure URL."
                        )
                      );

                      return;
                    }

                    resolve(
                      result.secure_url
                    );
                  }
                );

              uploadStream.end(buffer);
            }
          );
        })
      );

    // ========================================
    // 9. COMBINE IMAGES
    // ========================================

    const allImages = [
      ...existingImages,
      ...newImageUrls,
    ];

    // ========================================
    // 10. VALIDATE THUMBNAIL INDEX
    // ========================================

    const safeThumbnailIndex =
      Math.max(
        0,
        Math.min(
          thumbnailIndex,
          allImages.length - 1
        )
      );

    // ========================================
    // 11. VALIDATE PRODUCT
    // ========================================

    const validation =
      ProductSchema.safeParse({
        id,
        name,
        price,
        stock,
        status,
        images: allImages,
        thumbnail:
          safeThumbnailIndex,
        sales:
          existingProduct.sales,
        options,
        variants,
      });

    if (!validation.success) {
      console.error(
        "❌ ZOD VALIDATION FAILED:",
        validation.error.format()
      );

      return NextResponse.json(
        {
          error:
            "Product validation failed.",
          errors:
            validation.error.format(),
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // 12. SEPARATE RELATIONAL DATA
    // ========================================

    const {
      id: validatedId,
      options:
      validatedOptions,
      variants:
      validatedVariants,
      ...productData
    } = validation.data;

    // ========================================
    // 13. UPDATE PRODUCT
    // ========================================

    const updatedProduct =
      await prisma.product.update({
        where: {
          id,
        },

        data: {
          ...productData,

          // Replace all options
          options: {
            deleteMany: {},

            create:
              validatedOptions?.map(
                (option) => ({
                  name: option.name,
                  values: option.values,
                })
              ) ?? [],
          },

          // Replace all variants
          variants: {
            deleteMany: {},

            create:
              validatedVariants?.map(
                (variant) => ({
                  title:
                    variant.title,

                  sku:
                    variant.sku ??
                    null,

                  price:
                    variant.price ??
                    null,

                  stock:
                    variant.stock,

                  options:
                    variant.options,
                })
              ) ?? [],
          },
        },

        include: {
          options: true,
          variants: true,
        },
      });

    // ========================================
    // 14. RETURN UPDATED PRODUCT
    // ========================================

    return NextResponse.json(
      updatedProduct,
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "❌ Product update error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while updating the product.",
      },
      {
        status: 500,
      }
    );
  }
}

/* ==========================================
   DELETE PRODUCT
========================================== */

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const product =
      await prisma.product.findUnique({
        where: {
          id,
        },
      });

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        {
          status: 404,
        }
      );
    }
    await deleteImages(product.images);
    await prisma.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        message:
          "Product deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "❌ Product deletion error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete product",
      },
      {
        status: 500,
      }
    );
  }
}
