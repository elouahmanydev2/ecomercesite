"use client";

import { ProductStatus } from "@/generated/prisma/enums";
import {
  useAppDispatch,
  useAppSelector,
} from "@/hooks/hooks";
import { deleteAsset, deleteProduct, fetchProduct, updateProduct } from "@/lib/features/product/thunks/productThunk";
import { ProductVariantType } from "@/types/productType";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import StatusField from "./StatusField";
import OptionsBuilder from "./OptionsBuilder";
import VariantsBuilder from "./VariantsBuilder";
import { inputClass, labelClass } from "@/lib/styles/Styles";

type Option = {
  name: string;
  values: string[];
};

type ImageItem =
  | {
      type: "existing";
      url: string;
    }
  | {
      type: "new";
      file: File;
      previewUrl: string;
    };

interface EditProductProps {
  id: string;
}

export default function EditProductContent({
  id,
}: EditProductProps) {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const {
    product,
    loading,
    error,
  } = useAppSelector(
    (state) => state.product
  );

  // ==========================================
  // PRODUCT STATE
  // ==========================================

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [status, setStatus] =useState<ProductStatus>(ProductStatus.Draft);
  // ==========================================
  // OPTIONS & VARIANTS
  // ==========================================

  const [options, setOptions] =useState<Option[]>([]);
  const [variants, setVariants] =useState<ProductVariantType[]>([]);

  // ==========================================
  // IMAGES
  // ==========================================
  const [images, setImages] = useState<ImageItem[]>([]);
  const [thumbnailIndex, setThumbnailIndex] =useState(0);

  // ==========================================
  // UI STATE
  // ==========================================
  const [submitting, setSubmitting] =useState(false);
  const [deleting, setDeleting] =useState(false);
  const [showConfirm, setShowConfirm] =useState(false);
  const [formError, setFormError] =useState<string | null>(null);
  // ==========================================
  // FETCH PRODUCT
  // ==========================================

  useEffect(() => {
    if (!id) return;
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  // ==========================================
  // LOAD PRODUCT INTO FORM
  // ==========================================

  useEffect(() => {
    if (!product) return;

    setName(product.name);

    setPrice(
      product.price.toString()
    );

    setStock(
      product.stock.toString()
    );

    setStatus(product.status);

    // ----------------------------------------
    // LOAD IMAGES
    // ----------------------------------------

    const productImages =
      product.images.map((url) => ({
        type: "existing" as const,
        url,
      }));

    setImages(productImages);

    // ----------------------------------------
    // LOAD THUMBNAIL
    // ----------------------------------------

    const savedThumbnail =
      Number(product.thumbnail);

    setThumbnailIndex(
      savedThumbnail >= 0 &&
        savedThumbnail <
          product.images.length
        ? savedThumbnail
        : 0
    );

    // ----------------------------------------
    // LOAD OPTIONS
    // ----------------------------------------

    const productOptions: Option[] =
      product.options?.map(
        (option) => ({
          name: option.name,
          values: option.values,
        })
      ) ?? [];

    setOptions(productOptions);

    // ----------------------------------------
    // LOAD VARIANTS
    // ----------------------------------------

    const productVariants =
      product.variants?.map(
        (variant) => ({
          title: variant.title,
          sku: variant.sku ?? "",
          price: variant.price ?? 0,
          stock: variant.stock ?? 0,
          options: variant.options,
        })
      ) ?? [];

    setVariants(productVariants);

  }, [product]);

  // ==========================================
  // CLEANUP NEW IMAGE PREVIEWS
  // ==========================================

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.type === "new") {
          URL.revokeObjectURL(
            image.previewUrl
          );
        }
      });
    };
  }, []);

  // ==========================================
  // ADD OPTION
  // ==========================================

  function handleAddOption() {
    setOptions((previousOptions) => [
      ...previousOptions,
      {
        name: "",
        values: [],
      },
    ]);
  }

  // ==========================================
  // UPDATE OPTION NAME
  // ==========================================

  function handleOptionNameChange(
    index: number,
    value: string
  ) {
    setOptions((previousOptions) =>
      previousOptions.map(
        (option, optionIndex) =>
          optionIndex === index
            ? {
                ...option,
                name: value,
              }
            : option
      )
    );
  }

  // ==========================================
  // UPDATE OPTION VALUES
  // ==========================================

  function handleOptionValuesChange(
    index: number,
    value: string
  ) {
    const values = value
      .split(",")
      .map((item) => item.trim())

    setOptions((previousOptions) =>
      previousOptions.map(
        (option, optionIndex) =>
          optionIndex === index
            ? {
                ...option,
                values,
              }
            : option
      )
    );
  }

  // ==========================================
  // REMOVE OPTION
  // ==========================================

  function handleRemoveOption(
    index: number
  ) {
    setOptions((previousOptions) =>
      previousOptions.filter(
        (_, optionIndex) =>
          optionIndex !== index
      )
    );
  }

  // ==========================================
  // GENERATE VARIANTS
  // ==========================================

  function generateVariants() {
    const validOptions =
      options.filter(
        (option) =>
          option.name.trim() !== "" &&
          option.values.length > 0
      );

    if (
      validOptions.length === 0
    ) {
      setFormError(
        "Please add at least one valid option with values."
      );

      return;
    }

    const combine = (
      opts: Option[],
      prefix: Record<
        string,
        string
      > = {}
    ): Record<
      string,
      string
    >[] => {
      if (opts.length === 0) {
        return [prefix];
      }

      const [
        first,
        ...rest
      ] = opts;

      return first.values.flatMap(
        (value) =>
          combine(rest, {
            ...prefix,
            [first.name]: value,
          })
      );
    };

    const combinations =
      combine(validOptions);

    // ----------------------------------------
    // Preserve existing variant data
    // ----------------------------------------

    const newVariants =
      combinations.map(
        (combo, index) => {
          const existingVariant =
            variants.find(
              (variant) =>
                JSON.stringify(
                  variant.options
                ) ===
                JSON.stringify(combo)
            );

          return {
            title:
              Object.values(combo).join(
                " / "
              ),

            sku:
              existingVariant?.sku ??
              `SKU-${index + 1}`,

            price:
              existingVariant?.price &&
              Number(price) ||
              0,

            stock:
              existingVariant?.stock &&
              Number(stock) ||
              0,

            options: combo,
          };
        }
      );

    setVariants(newVariants);

    setFormError(null);
  }

  // ==========================================
  // UPDATE VARIANT
  // ==========================================

  function handleVariantChange(
    index: number,
    field:
      | "sku"
      | "price"
      | "stock",
    value: string
  ) {
    setVariants(
      (previousVariants) =>
        previousVariants.map(
          (
            variant,
            variantIndex
          ) => {
            if (
              variantIndex !==
              index
            ) {
              return variant;
            }

            if (field === "sku") {
              return {
                ...variant,
                sku: value,
              };
            }

            if (
              field === "price"
            ) {
              return {
                ...variant,
                price:
                  Number(value) ||
                  0,
              };
            }

            return {
              ...variant,
              stock:
                Number(value) ||
                0,
            };
          }
        )
    );
  }

  // ==========================================
  // REMOVE VARIANT
  // ==========================================

  function handleRemoveVariant(
    index: number
  ) {
    setVariants(
      (previousVariants) =>
        previousVariants.filter(
          (_, variantIndex) =>
            variantIndex !== index
        )
    );
  }

  // ==========================================
  // ADD IMAGES
  // ==========================================

  function handleAddFiles(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const selected =
      Array.from(
        e.target.files ?? []
      );

    if (
      selected.length === 0
    ) {
      return;
    }

    if (
      images.length +
        selected.length >
      5
    ) {
      setFormError(
        "You can have a maximum of 5 images."
      );

      e.target.value = "";

      return;
    }

    const newItems: ImageItem[] =
      selected.map(
        (file) => ({
          type: "new" as const,
          file,
          previewUrl:
            URL.createObjectURL(
              file
            ),
        })
      );

    setImages(
      (previousImages) => [
        ...previousImages,
        ...newItems,
      ]
    );

    setFormError(null);

    e.target.value = "";
  }

  // ==========================================
  // REMOVE IMAGE
  // ==========================================
 const handleRemoveImage = async (
  index: number,
  imageUrl: string
) => {
      if (!confirm('Are you sure you want to delete this image?')) return;

  const image = images[index];

  // Delete only existing Cloudinary images
  if (image?.type === "existing") {
    try {
      await dispatch(deleteAsset(imageUrl)).unwrap();
    } catch (err) {
      console.error(err);
      return;
    }
  }

  setImages((previousImages) => {
    const target = previousImages[index];

    if (target?.type === "new") {
      URL.revokeObjectURL(target.previewUrl);
    }

    const updated = previousImages.filter(
      (_, imageIndex) => imageIndex !== index
    );

    if (updated.length === 0) {
      setThumbnailIndex(0);
    } else if (thumbnailIndex === index) {
      setThumbnailIndex(0);
    } else if (thumbnailIndex > index) {
      setThumbnailIndex((previous) => previous - 1);
    } else if (thumbnailIndex >= updated.length) {
      setThumbnailIndex(updated.length - 1);
    }

    return updated;
  });
};

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setFormError(null);

    if (!id) {
      return;
    }

    // ----------------------------------------
    // BASIC VALIDATION
    // ----------------------------------------

    if (
      !name.trim()
    ) {
      setFormError(
        "Product name is required."
      );

      return;
    }

    if (
      !price ||
      Number(price) < 0
    ) {
      setFormError(
        "Please enter a valid price."
      );

      return;
    }

    if (
      Number(stock) < 0
    ) {
      setFormError(
        "Stock cannot be negative."
      );

      return;
    }

    if (
      images.length === 0
    ) {
      setFormError(
        "At least one image is required."
      );

      return;
    }

    // ----------------------------------------
    // EXISTING IMAGES
    // ----------------------------------------

    const existingImages =
      images
        .filter(
          (
            image
          ): image is Extract<
            ImageItem,
            {
              type: "existing";
            }
          > =>
            image.type ===
            "existing"
        )
        .map(
          (image) =>
            image.url
        );

    // ----------------------------------------
    // NEW FILES
    // ----------------------------------------

    const newFiles =
      images
        .filter(
          (
            image
          ): image is Extract<
            ImageItem,
            {
              type: "new";
            }
          > =>
            image.type ===
            "new"
        )
        .map(
          (image) =>
            image.file
        );

    // ----------------------------------------
    // CREATE FORMDATA
    // ----------------------------------------

    const formData =
      new FormData();

    formData.append("name",name.trim() );
    formData.append("price",String(Number(price)));
    formData.append("stock",String( Number(stock)));
    formData.append("status",status);
    formData.append( "thumbnailIndex", String(thumbnailIndex));

    // ----------------------------------------
    // EXISTING IMAGES
    // ----------------------------------------
    formData.append( "existingImages",JSON.stringify(existingImages));
    // ----------------------------------------
    // OPTIONS
    // ----------------------------------------
    formData.append("options", JSON.stringify(options));

    // ----------------------------------------
    // VARIANTS
    // ----------------------------------------

    formData.append(
      "variants",
      JSON.stringify(
        variants
      )
    );

    // ----------------------------------------
    // NEW IMAGES
    // ----------------------------------------

    newFiles.forEach(
      (file) => {
        formData.append(
          "files",
          file
        );
      }
    );

    // ----------------------------------------
    // UPDATE
    // ----------------------------------------

    setSubmitting(true);

    try {
      await dispatch(
        updateProduct({
          id,
          formData,
        })
      ).unwrap();

      router.push(
        "/dashboard/products"
      );
    } catch (error) {
      console.error(
        "❌ Update product error:",
        error
      );

      setFormError(
        typeof error ===
          "string"
          ? error
          : "Failed to update product."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  async function handleDelete() {
    if (!id) {
      return;
    }

    setDeleting(true);

    setFormError(null);

    try {
      await dispatch(
        deleteProduct(id)
      ).unwrap();

      router.push(
        "/dashboard/products"
      );
    } catch (error) {
      console.error(
        "❌ Delete product error:",
        error
      );

      setFormError(
        typeof error ===
          "string"
          ? error
          : "Failed to delete product."
      );

      setShowConfirm(false);
    } finally {
      setDeleting(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (
    loading &&
    !product
  ) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <div className="text-sm text-neutral-500">
          Loading product...
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (
    error &&
    !product
  ) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }


  return (
   <div className="min-h-screen px-4 py-10 sm:px-6">
  <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 shadow-xl backdrop-blur-sm">

    {/* ====================================
        HEADER
    ==================================== */}
    <div className="border-b border-zinc-800 px-6 py-5 sm:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 sm:text-2xl">
            Edit Product
          </h1>

          <p className="mt-1 text-sm text-zinc-400">
            Update product details, images, options, and variants.
          </p>
        </div>
      </div>
    </div>

    {/* ====================================
        FORM
    ==================================== */}
    <form
      onSubmit={handleSubmit}
      className="space-y-8 p-6 sm:p-8"
    >

      {/* ==================================
          ERROR DISPLAY
      ================================== */}
      {formError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <div className="font-semibold text-red-300">
            Unable to update product
          </div>

          <div className="mt-1 text-red-300/90">
            {formError}
          </div>
        </div>
      )}

      {/* ==================================
          IMAGES
      ================================== */}
      <section className="space-y-4">
        <h2 className="border-b border-zinc-800 pb-2 text-base font-semibold text-zinc-300">
          Product Images
        </h2>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {images.map((image, index) => {
            const src =
              image.type === "existing"
                ? image.url
                : image.previewUrl;

            return (
              <div
                key={
                  image.type === "existing"
                    ? image.url
                    : image.previewUrl
                }
                className={`group relative aspect-square overflow-hidden rounded-lg border-2 ${
                  thumbnailIndex === index
                    ? "border-indigo-500"
                    : "border-zinc-800"
                }`}
              >
                <img
                  src={src}
                  alt={`Product image ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                {/* Thumbnail Tag / Select */}
                <button
                  type="button"
                  onClick={() => setThumbnailIndex(index)}
                  className={`absolute bottom-1 left-1 rounded px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-md ${
                    thumbnailIndex === index
                      ? "bg-indigo-600/90"
                      : "bg-black/80 hover:bg-black"
                  }`}
                >
                  {thumbnailIndex === index
                    ? "Thumbnail"
                    : "Set Thumbnail"}
                </button>

                {/* Remove Image */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index, src)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-xs text-zinc-300 opacity-0 transition group-hover:opacity-100 hover:bg-red-600 hover:text-white"
                >
                  ✕
                </button>
              </div>
            );
          })}

          {/* Add Image Button */}
          {images.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-zinc-800 bg-zinc-900/30 text-sm text-zinc-400 transition hover:border-indigo-500 hover:bg-zinc-900/60 hover:text-indigo-400"
            >
              + Add Image
            </button>
          )}
        </div>

        <p className="text-xs text-zinc-500">
          {images.length} of 5 images selected. The first image can be used as the thumbnail.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleAddFiles}
        />
      </section>

      {/* ==================================
          BASIC INFORMATION
      ================================== */}
      <section className="space-y-4">
        <h2 className="border-b border-zinc-800 pb-2 text-base font-semibold text-zinc-300">
          Basic Information
        </h2>

        {/* Product Name */}
        <InputField
          labelClass={labelClass}
          inputClass={inputClass}
          label={'Product Name'}
          name={'name'}
          inputType={"text"}
          value={name}
          placeholder={"e.g. Premium Cotton Hoodie"}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Price + Stock */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            labelClass={labelClass}
            inputClass={inputClass}
            label={'Base Price ($)'}
            name={'price'}
            value={price}
            inputType={"number"}
            placeholder={"0.00"}
            onChange={(e) => setPrice(e.target.value)}
          />

          <InputField
            labelClass={labelClass}
            inputClass={inputClass}
            label={'Base Stock'}
            name={'stock'}
            value={stock}
            inputType={"number"}
            placeholder={"0"}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        {/* Status */}
        <StatusField
          labelClass={labelClass}
          inputClass={inputClass}
          status={status}
          onChange={(e) => setStatus(e.target.value as ProductStatus)}
        />
      </section>

      {/* ==================================
          OPTIONS
      ================================== */}
      <OptionsBuilder
        options={options}
        inputClass={inputClass}
        addOption={handleAddOption}
        removeOption={handleRemoveOption}
        updateOptionName={handleOptionNameChange}
        updateOptionValues={handleOptionValuesChange}
        generateVariants={generateVariants}
      />

      {/* ==================================
          VARIANTS
      ================================== */}
      {variants.length > 0 && (
        <VariantsBuilder
          variants={variants}
          inputClass={inputClass}
          labelClass={labelClass}
          updateVariant={handleVariantChange}
          removeVariant={handleRemoveVariant}
        />
      )}

      {/* ==================================
          ACTIONS
      ================================== */}
      <div className="flex flex-col gap-4 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center sm:justify-between">

        {/* Delete Trigger & Controls */}
        {!showConfirm ? (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
          >
            Delete Product
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-red-400">
              Are you sure?
            </span>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500 disabled:opacity-40"
            >
              {deleting ? "Deleting..." : "Yes, Delete"}
            </button>

            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Save / Cancel */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={submitting || deleting}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting || deleting || loading}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>

    </form>
  </div>
</div>
  );
}
