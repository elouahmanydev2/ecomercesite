// src/lib/auth/requirePermission.ts

import { NextResponse } from "next/server";
import { getSessionInstance } from "./getSessionInstance";

export async function requirePermission(
  allowedRoles: readonly string[]
) {
  const session = await getSessionInstance();

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  
    if (session.user.role && !allowedRoles.includes(session.user.role)) {
    return {
      error: NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      ),
    };
  }

  return {
    session,
  };
}