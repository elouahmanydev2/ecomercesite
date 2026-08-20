import { Roles } from "@/generated/prisma/enums";
import z from "zod";

export const UserSchema = {
    id:z.string(),
    name:z.string(),
    email:z.email(),
    emailVerified: z.boolean().default(false),
    image:z.string().optional(),
    createdAt:z.date().optional(),
    updatedAt:z.date().optional(),
    role:z.enum(Roles),
    banned:z.boolean().optional(),
    banReason:z.string().optional(),
    banExpire:z.date().optional()
}

export const BanSchema ={
    id:z.string(),
    name:z.string(),
}

export type UserType ={
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  role: Roles;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: string | null;
};
export type BanType = {
    id:string ;
    name:string;
}