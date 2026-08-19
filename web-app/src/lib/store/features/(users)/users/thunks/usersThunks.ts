import {createAsyncThunk} from "@reduxjs/toolkit";
import { Roles } from "@/generated/prisma/enums";
import api from "@/lib/axios";
import { UserType } from "@/types/usersType";

// ── Thunks ─────────────────────────────────────────────────────────────────
export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (params: { search?: string; role?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.role && params.role !== "all") query.set("role", params.role);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const res = await api.get(`/dashboard/users?${query.toString()}`);
    if (!res.data) throw new Error("Failed to fetch users");
    
    return res.data as { users: UserType[]; total: number };
  }
);

export const deleteUser = createAsyncThunk("users/delete", async (id: string) => {
//   const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
const res = await api.delete(`/dashboard/users/${id}`)
  if (!res.data) throw new Error("Failed to delete user");
  return id;
});

export const updateUserRole = createAsyncThunk(
  "users/updateRole",
  async ({ id, role }: { id: string; role: Roles }) => {
    
    const res= await api.patch(`/dashboard/users/${id}/role`,{
      role:role,
    })
    if (!res.data) throw new Error("Failed to update role");
    return { id, role };
  }
);

export const banUser = createAsyncThunk(
  "users/ban",
  async ({ id, reason }: { id: string; reason: string }) => {

    const res = await api.patch(`/dashboard/users/${id}/ban`,{
      banned:true, 
      banReason:reason
    })
    if (!res.data) throw new Error("Failed to ban user");
    return id;
  }
);

export const unbanUser = createAsyncThunk("users/unban", async (id: string) => {
 const res = await api.patch(`/dashboard/users/${id}/ban`,{
      banned:false, 
    })
    if (!res.data) throw new Error("Failed to unban user");
    return id;
});