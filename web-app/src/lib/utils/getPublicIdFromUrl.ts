export function getPublicId(imageUrl: string) {
  try {
    const url = new URL(imageUrl);

    const parts = url.pathname.split("/");

    // find upload
    const uploadIndex = parts.findIndex(
      (part) => part === "upload"
    );

    if (uploadIndex === -1) return null;

    // remove upload + version
    const publicId = parts
      .slice(uploadIndex + 2)
      .join("/")
      .replace(/\.[^.]+$/, "");

    return publicId;
  } catch {
    return null;
  }
}