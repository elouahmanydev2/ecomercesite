// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Roles } from "@/generated/prisma/enums";
import { can } from "@/hooks/can";
import { PERMISSIONS } from "@/lib/auth/permissions";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {id} = await params;
  if (!id) {
   return NextResponse.json({ error: "User not found" }, { status: 404 });

  }
 if (!can(session.user.role as Roles,PERMISSIONS.users.delete)) {
       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
 
   }

  
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}