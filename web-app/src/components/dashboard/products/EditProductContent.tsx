"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { deleteProduct, fetchProduct, updateProduct } from "@/lib/features/product/thunks/productThunk";

type ImageItem =
  | { type: "existing"; url: string }
  | { type: "new"; file: File; previewUrl: string };

interface EditProductProps{
    id:string
}

export default function EditProductContent({id}:EditProductProps) {

  const router = useRouter();

  const dispatch = useAppDispatch();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { product, loading, error } = useAppSelector(
    (state) => state.product
  );
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState<"Draft" | "Active">("Draft");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!product) return;

    setName(product.name);

    setPrice(product.price.toString());

    setStock(product.stock.toString());

    setStatus(product.status);

    const productImages = product.images.map((url) => ({
      type: "existing" as const,
      url,
    }));

    setImages(productImages);


    const index = product.thumbnail

    setThumbnailIndex(index >= 0 ? index : 0);
  }, [product]);

  // Revoke object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.type === "new") URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, []);
  //Add Image
  function handleAddFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;

    const newItems: ImageItem[] = selected.map((file) => ({
      type: "new",
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newItems]);
    e.target.value = ""; // allow re-selecting the same file
  }
  //Remove Image
  function handleRemoveImage(index: number) {
    setImages((prev) => {
      const target = prev[index];

      if (target.type === "new") {
        URL.revokeObjectURL(target.previewUrl);
      }

      const updated = prev.filter((_, i) => i !== index);

      if (thumbnailIndex === index) {
        setThumbnailIndex(0);
      } else if (thumbnailIndex > index) {
        setThumbnailIndex((prev) => prev - 1);
      }

      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setFormError(null);

    if (!id) return;

    if (images.length === 0) {
      setFormError("At least one image is required.");
      return;
    }

    const existingImages = images
      .filter(
        (img): img is Extract<ImageItem, { type: "existing" }> =>
          img.type === "existing"
      )
      .map((img) => img.url);

    const newFiles = images
      .filter(
        (img): img is Extract<ImageItem, { type: "new" }> =>
          img.type === "new"
      )
      .map((img) => img.file);

    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("status", status);
    formData.append("thumbnailIndex", thumbnailIndex.toString());
    console.log(formData.append("thumbnailIndex", thumbnailIndex.toString()), `ththth`);

    formData.append(
      "existingImages",
      JSON.stringify(existingImages)
    );

    newFiles.forEach((file) => {
      formData.append("files", file);
    });

    setSubmitting(true);

    const result = await dispatch(
      updateProduct({
        id,
        formData,
      })
    );

    setSubmitting(false);

    if (updateProduct.fulfilled.match(result)) {
      router.push("/dashboard/products");
      return;
    }

    setFormError(
      (result.payload as string) ??
      "Failed to update product."
    );
  }
  if (loading && !product) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        {error}
      </div>
    );
  }

  //Delete Product
  async function handleDelete() {
    if (!id) return;

    setDeleting(true);
    setFormError(null);

    const result = await dispatch(deleteProduct(id));

    setDeleting(false);

    if (deleteProduct.fulfilled.match(result)) {
      router.push("/dashboard/products"); // Redirect to product list on success
      return;
    }

    setFormError(
      (result.payload as string) ?? "Failed to delete product."
    );
    setShowConfirm(false); // Reset confirm state if it failed
  }
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">Edit product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Images
          </label>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((img, index) => {
              const src = img.type === "existing" ? img.url : img.previewUrl;
              return (
                <div
                  key={index}
                  className={`group relative aspect-square overflow-hidden rounded-lg border-2 ${thumbnailIndex === index
                    ? "border-blue-600"
                    : "border-neutral-200"
                    }`}                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Product image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setThumbnailIndex(index)}
                    className={`absolute bottom-1 left-1 rounded px-2 py-1 text-xs text-white ${thumbnailIndex === index
                      ? "bg-blue-600"
                      : "bg-black/70"
                      }`}
                  >
                    {thumbnailIndex === index ? "Thumbnail" : "Set Thumbnail"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-neutral-300 text-sm text-neutral-500 hover:border-neutral-400 hover:text-neutral-700"
            >
              + Add
            </button>
          </div>
          <input
            ref={fileInputRef}

            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleAddFiles}
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-neutral-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>

        {/* Price + stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium text-neutral-700">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="stock" className="mb-1 block text-sm font-medium text-neutral-700">
              Stock
            </label>
            <input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium text-neutral-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as "Draft" | "Active")}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          >
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
          </select>
        </div>

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        {/* Form Actions */}
        <div className="flex items-center justify-between border-t border-neutral-100 pt-6">
          {/* Left Aligned: Delete Trigger */}
          {!showConfirm ? (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete product
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-600 font-medium">Are you sure?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Right Aligned: Save / Cancel Form Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || deleting}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </form>

    </div>
  );
}