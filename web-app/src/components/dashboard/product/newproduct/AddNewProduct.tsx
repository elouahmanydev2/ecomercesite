"use client";

import ImageForm from "@/components/dashboard/product/ImageForm";
import InputField from "@/components/dashboard/product/InputField";
import OptionsBuilder from "@/components/dashboard/product/OptionsBuilder";
import StatusField from "@/components/dashboard/product/StatusField";
import VariantsBuilder from "@/components/dashboard/product/VariantsBuilder";
import { ProductStatus } from "@/generated/prisma/enums";
import {
  useAppDispatch,
  useAppSelector,
} from "@/hooks/hooks";
import { createProduct } from "@/lib/store/features/dashboard/product/thunks/productThunk";
import { inputClass, labelClass } from "@/lib/styles/Styles";
import { ProductVariantType } from "@/types/productType";
import { useState } from "react";

type Option = {
  name: string;
  values: string[];
};

type PreviewFile = {
  file: File;
  preview: string;
};

export default function AddNewProduct() {
  const dispatch = useAppDispatch();

  const {
    error: reduxError,
    loading,
  } = useAppSelector((state) => state.dashboard.product);

  // ==========================================
  // PRODUCT STATE
  // ==========================================

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");

  const [status, setStatus] = useState<ProductStatus>(
    ProductStatus.Draft
  );

  // ==========================================
  // OPTIONS & VARIANTS
  // ==========================================

  const [options, setOptions] = useState<Option[]>([]);

  const [variants, setVariants] = useState<
    ProductVariantType[]
  >([]);

  // ==========================================
  // IMAGES
  // ==========================================

  const [files, setFiles] = useState<PreviewFile[]>([]);

  // ==========================================
  // ERRORS
  // ==========================================

  const [errors, setErrors] = useState<
    string | object | null
  >(null);

  // ==========================================
  // GENERATE VARIANTS
  // ==========================================

  function generateVariants() {
    if (options.length === 0) {
      return;
    }

    const validOptions = options.filter(
      (option) =>
        option.name.trim() !== "" &&
        option.values.length > 0
    );

    if (validOptions.length === 0) {
      setErrors(
        "Please add at least one valid option with values."
      );

      return;
    }

    const combine = (
      opts: Option[],
      prefix: Record<string, string> = {}
    ): Record<string, string>[] => {
      if (opts.length === 0) {
        return [prefix];
      }

      const [first, ...rest] = opts;

      return first.values.flatMap((value) =>
        combine(rest, {
          ...prefix,
          [first.name]: value,
        })
      );
    };

    const combinations = combine(validOptions);

    setVariants(
      combinations.map((combo, index) => ({
        title: Object.values(combo).join(" / "),
        sku: `SKU-${index + 1}`,
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        options: combo,
      }))
    );

    setErrors(null);
  }

  // ==========================================
  // SELECT IMAGES
  // ==========================================

  const handleSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(
      e.target.files || []
    );

    if (selectedFiles.length === 0) {
      return;
    }

    if (
      selectedFiles.length + files.length >
      5
    ) {
      setErrors(
        "You can upload a maximum of 5 images."
      );

      e.target.value = "";

      return;
    }

    const newPreviewFiles: PreviewFile[] =
      selectedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    setFiles((previousFiles) => [
      ...previousFiles,
      ...newPreviewFiles,
    ]);

    setErrors(null);

    // Allow selecting the same file again
    e.target.value = "";
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const removeImage = (index: number) => {
    setFiles((previousFiles) => {
      const target = previousFiles[index];

      if (target) {
        URL.revokeObjectURL(target.preview);
      }

      return previousFiles.filter(
        (_, fileIndex) =>
          fileIndex !== index
      );
    });
  };

  // ==========================================
  // ADD OPTION
  // ==========================================

  const addOption = () => {
    setOptions((previousOptions) => [
      ...previousOptions,
      {
        name: "",
        values: [],
      },
    ]);
  };

  // ==========================================
  // UPDATE OPTION NAME
  // ==========================================

  const updateOptionName = (
    index: number,
    value: string
  ) => {
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
  };

  // ==========================================
  // UPDATE OPTION VALUES
  // ==========================================

  const updateOptionValues = (
    index: number,
    value: string
  ) => {
    const values = value
      .split(",")
      .map((item) => item.trim());

    setOptions((previousOptions) =>
      previousOptions.map((option, optionIndex) =>
        optionIndex === index
          ? {
            ...option,
            values,
          }
          : option
      )
    );
  };
  // ==========================================
  // REMOVE OPTION
  // ==========================================

  const removeOption = (index: number) => {
    setOptions((previousOptions) =>
      previousOptions.filter(
        (_, optionIndex) =>
          optionIndex !== index
      )
    );
  };

  // ==========================================
  // UPDATE VARIANT
  // ==========================================

  const updateVariant = (
    index: number,
    field: "sku" | "price" | "stock",
    value: string
  ) => {
    setVariants((previousVariants) =>
      previousVariants.map(
        (variant, variantIndex) => {
          if (variantIndex !== index) {
            return variant;
          }

          if (field === "sku") {
            return {
              ...variant,
              sku: value,
            };
          }

          if (field === "price") {
            return {
              ...variant,
              price: Number(value) || 0,
            };
          }

          return {
            ...variant,
            stock: Number(value) || 0,
          };
        }
      )
    );
  };

  // ==========================================
  // REMOVE VARIANT
  // ==========================================

  const removeVariant = (index: number) => {
    setVariants((previousVariants) =>
      previousVariants.filter(
        (_, variantIndex) =>
          variantIndex !== index
      )
    );
  };

  // ==========================================
  // SUBMIT PRODUCT
  // ==========================================

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setErrors(null);

    // ------------------------------------------
    // BASIC VALIDATION
    // ------------------------------------------

    if (!name.trim()) {
      setErrors("Product name is required.");
      return;
    }

    if (!price || Number(price) < 0) {
      setErrors(
        "Please enter a valid product price."
      );
      return;
    }

    if (Number(stock) < 0) {
      setErrors(
        "Stock cannot be negative."
      );
      return;
    }

    if (files.length === 0) {
      setErrors(
        "Please select at least one product image."
      );
      return;
    }

    // ------------------------------------------
    // CREATE FORMDATA
    // ------------------------------------------

    const formData = new FormData();

    // Basic product data
    formData.append("name", name.trim());
    formData.append("price", String(Number(price)));
    formData.append("stock", String(Number(stock)));
    formData.append("status", status);

    // First image is the thumbnail
    formData.append("thumbnailIndex", "0");

    // ------------------------------------------
    // OPTIONS
    // ------------------------------------------
    formData.append("options", JSON.stringify(options));

    // ------------------------------------------
    // VARIANTS
    // ------------------------------------------

    formData.append("variants", JSON.stringify(variants));

    // ------------------------------------------
    // IMAGES
    // ------------------------------------------

    files.forEach((item) => { formData.append("files", item.file); });

    // ------------------------------------------
    // SEND REQUEST
    // ------------------------------------------

    try {
      const createdProduct =
        await dispatch(
          createProduct(formData)
        ).unwrap();

      console.log(
        "✅ Product created successfully:",
        createdProduct
      );

      alert(
        "✅ Product created successfully!"
      );

      // ----------------------------------------
      // RESET FORM
      // ----------------------------------------

      setName("");
      setPrice("");
      setStock("0");

      setStatus(
        ProductStatus.Draft
      );

      setOptions([]);
      setVariants([]);

      files.forEach((item) => {
        URL.revokeObjectURL(
          item.preview
        );
      });

      setFiles([]);

      setErrors(null);
    } catch (error) {
      console.error(
        "❌ Failed to create product:",
        error
      );

      setErrors(`${error}`);
    }
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
  <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 shadow-xl backdrop-blur-sm">

    {/* ====================================
        HEADER
    ==================================== */}
    <div className="border-b border-zinc-800 px-6 py-5 sm:px-8">
      <h1 className="text-xl font-bold text-zinc-100 sm:text-2xl">
        Create New Product
      </h1>

      <p className="mt-1 text-sm text-zinc-400">
        Configure product details, images, options, and variants.
      </p>
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
      {(errors || reduxError) && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <div className="mb-1 font-semibold text-red-300">
            Failed to create product
          </div>

          <pre className="overflow-x-auto whitespace-pre-wrap rounded border border-red-500/20 bg-zinc-950/60 p-2 text-xs font-mono text-red-300">
            {typeof errors === "string"
              ? errors
              : errors
                ? JSON.stringify(
                  errors,
                  null,
                  2
                )
                : reduxError}
          </pre>
        </div>
      )}

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

        {/* Price & Stock */}
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
          IMAGE UPLOAD
      ================================== */}
      <ImageForm
        files={files}
        handleSelectImages={handleSelect}
        removeImage={removeImage} 
      />

      {/* ==================================
          OPTIONS BUILDER
      ================================== */}
      <OptionsBuilder
        options={options}
        inputClass={inputClass}
        addOption={addOption}
        removeOption={removeOption}
        updateOptionName={updateOptionName}
        updateOptionValues={updateOptionValues}
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
          updateVariant={updateVariant}
          removeVariant={removeVariant} 
        />
      )}

      {/* ==================================
          SUBMIT
      ================================== */}
      <div className="border-t border-zinc-800 pt-4">
        <button
          type="submit"
          disabled={
            loading ||
            files.length === 0
          }
          className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          {loading ? (
            <>
              <svg
                className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2.647-2.647z"
                />
              </svg>
              Creating Product...
            </>
          ) : (
            "Create Product"
          )}
        </button>
      </div>

    </form>
  </div>
</div>
  );
}