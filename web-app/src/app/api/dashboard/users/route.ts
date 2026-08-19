// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Roles } from "@/generated/prisma/enums";
import { can } from "@/hooks/can";
import prisma from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/auth/permissions";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = session.user.role as Roles;

  if (!can(userRole, PERMISSIONS.users.view)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  }


  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") as Roles | null;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const where = {
    AND: [
      search
        ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
        : {},
      role ? { role } : {},
    ],
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        banned: true,
        banReason: true,
        banExpire: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ users, total });
}