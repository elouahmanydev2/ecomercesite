import cloudinary from "@/lib/cloudinary";
import { getPublicId } from "@/lib/utils/getPublicIdFromUrl";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        {
          message: "Image URL is required",
        },
        { status: 400 }
      );
    }

    const publicId = getPublicId(imageUrl);

    if (!publicId) {
      return NextResponse.json(
        {
          message: "Invalid image URL",
        },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to delete image",
      },
      {
        status: 500,
      }
    );
  }
}