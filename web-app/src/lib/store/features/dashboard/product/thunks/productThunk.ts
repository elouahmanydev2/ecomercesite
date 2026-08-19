import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ProductType } from "@/types/productType";

/* ==========================================
   CREATE PRODUCT
========================================== */

export const createProduct = createAsyncThunk<
  ProductType,
  FormData,
  { rejectValue: string }
>(
  "products/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<ProductType>(
        "/api/dashboard/products",
        formData
      );

      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        if (responseData?.errors) {
          return rejectWithValue(
            typeof responseData.errors === "string"
              ? responseData.errors
              : JSON.stringify(responseData.errors, null, 2)
          );
        }

        if (responseData?.error) {
          return rejectWithValue(responseData.error);
        }
      }

      return rejectWithValue("Failed to create product");
    }
  }
);

/* ==========================================
   FETCH ONE PRODUCT
========================================== */

export const fetchProduct = createAsyncThunk<
  ProductType,
  string,
  { rejectValue: string }
>(
  "products/fetchProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<ProductType>(
        `/api/dashboard/products/${id}`
      );

      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error ||
            "Failed to fetch product"
        );
      }

      return rejectWithValue("Failed to fetch product");
    }
  }
);

/* ==========================================
   UPDATE PRODUCT
========================================== */

export const updateProduct = createAsyncThunk<
  ProductType,
  {
    id: string;
    formData: FormData;
  },
  { rejectValue: string }
>(
  "products/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put<ProductType>(
        `/api/dashboard/products/${id}`,
        formData
      );

      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        if (responseData?.errors) {
          return rejectWithValue(
            typeof responseData.errors === "string"
              ? responseData.errors
              : JSON.stringify(responseData.errors, null, 2)
          );
        }

        return rejectWithValue(
          responseData?.error ||
            "Failed to update product"
        );
      }

      return rejectWithValue("Failed to update product");
    }
  }
);

/* ==========================================
   DELETE PRODUCT
========================================== */

export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/dashboard/products/${id}`);

      return id;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error ||
            "Failed to delete product"
        );
      }

      return rejectWithValue("Failed to delete product");
    }
  }
);

// Delete Assest
export const deleteAsset = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>(
  "upload/deleteAsset",
  async (imageUrl, { rejectWithValue }) => {
    try {
      await axios.delete("/api/cdn/delete", {
        data: {
          imageUrl,
        },
      });
    } catch (error) {
      return rejectWithValue(
        "Failed to delete image."
      );
    }
  }
);
