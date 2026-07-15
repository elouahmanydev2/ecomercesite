import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ProductType } from "@/types/productType";

/* ===========================
   CREATE PRODUCT
=========================== */

export const createProduct = createAsyncThunk<
  ProductType,
  FormData,
  { rejectValue: string }
>(
  "products/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<ProductType>(
        "/api/products",
        formData
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.errors ||
          "Failed to create product"
      );
    }
  }
);

/* ===========================
   FETCH ONE PRODUCT
=========================== */

export const fetchProduct = createAsyncThunk<
  ProductType,
  string,
  { rejectValue: string }
>(
  "products/fetchProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<ProductType>(
        `/api/products/${id}`
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          "Failed to fetch product"
      );
    }
  }
);

/* ===========================
   UPDATE PRODUCT
=========================== */

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
        `/api/products/${id}`,
        formData
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.errors ||
          "Failed to update product"
      );
    }
  }
);

/* ===========================
   DELETE PRODUCT
=========================== */

export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/products/${id}`);

      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          "Failed to delete product"
      );
    }
  }
);