import { createAsyncThunk } from "@reduxjs/toolkit";
import { OrderType } from "@/types/orderType";
import { OrderStatus } from "@/generated/prisma/enums";
import axios from "axios";

/**
 * GET ALL ORDERS
 */
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/dashboard/orders')

      if (!res.data) {
        throw new Error("Failed to fetch orders");
      }

      return await res.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

/**
 * GET SINGLE ORDER
 */
export const fetchOrder = createAsyncThunk(
  "orders/fetchOrder",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/dashboard/orders/${id}`);

      if (!res.ok) {
        throw new Error("Failed to fetch order");
      }

      return await res.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

/**
 * CREATE ORDER
 */
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (data: OrderType, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/dashboard/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

/**
 * UPDATE ORDER
 */
export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async (
    {
      id,
      status,
    }: {
      id: string;
      status: OrderStatus;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`/api/dashboard/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({status}),
      });

      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

/**
 * DELETE ORDER
 */
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/dashboard/orders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete order");
      }

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);