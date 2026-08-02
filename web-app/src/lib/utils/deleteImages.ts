import cloudinary from "../cloudinary";
import { getPublicId } from "./getPublicIdFromUrl";

export async function deleteImages(images: string[]) {
  await Promise.all(
    images.map(async (imageUrl) => {
      const publicId = getPublicId(imageUrl);

      if (!publicId) return;

      await cloudinary.uploader.destroy(publicId);
    })
  );
}