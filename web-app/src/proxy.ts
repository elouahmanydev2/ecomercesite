import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Roles } from "@/generated/prisma/enums";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { can } from "@/hooks/can";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const pathname = request.nextUrl.pathname;


if (pathname.startsWith("/dashboard")) {

   if (!session) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }
     const role = session?.user?.role;

  if (
    !role ||
    !Object.values(Roles).includes(role as Roles) ||
    !can(role as Roles, PERMISSIONS.dashboard)
  ) {
    return new NextResponse(null, {
      status: 404,
    });
  }
}
// admin panel forbiden
// if (pathname.startsWith('/dashboard/')) {
//    if (!session) {
//       return NextResponse.redirect(
//         new URL("/login", request.url)
//       );
//     }

//     const role = session.user.role;

//     if (
//     !role ||
//     !Object.values(Roles).includes(role as Roles) ||
//     !can(role as Roles, PERMISSIONS.dashboard)
//   ) {
//     return new NextResponse(null, {
//       status: 404,
//     });
//   }
// }

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    if (session) {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }
  }

  return NextResponse.next();

}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/login/:path*",
    "/register/:path*",
  ],
};