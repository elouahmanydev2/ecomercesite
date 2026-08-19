import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";     // Adjust based on your path
import { Roles } from "@/generated/prisma/enums";
import { can } from "@/hooks/can";
import { PERMISSIONS } from "@/lib/auth/permissions";

export async function PATCH(
  req: NextRequest,
  { params }: { params:Promise<{ id: string }> }
) {
  try {
    // 1. Authentication Check
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Authorization Check (RBAC)
    const userRole = session.user.role as Roles;
    if (!can(userRole, PERMISSIONS.users.edit)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Safe Body Parsing (Prevents "Unexpected end of JSON input" crash)
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Malformed JSON payload or empty request body" },
        { status: 400 }
      );
    }

    const { banned , banReason} = body;

    
    const updated = await prisma.user.update({
      where: { id: (await params).id },
      data: { 
        banned: banned as boolean,
        banReason:banReason as string | null
      },
      select: { 
        id: true, 
        banned: true 
      },
    });

    // 6. Safe Serialized Response
    return NextResponse.json(updated, { status: 200 });

  } catch (globalError: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}