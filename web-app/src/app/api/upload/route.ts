import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    const urls = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());

        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result!.secure_url);
              }
            }
          );

          uploadStream.end(buffer);
        });
      })
    );

    return NextResponse.json({ urls });
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed", details: error },
      { status: 500 }
    );
  }
}