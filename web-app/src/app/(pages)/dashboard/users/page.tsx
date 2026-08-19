"use client";

import { Roles } from "@/generated/prisma/enums";
import { can } from "@/hooks/can";
import { authClient } from "@/lib/authClient";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { notFound } from "next/navigation";
import UsersContent from "@/components/dashboard/users/UsersContent";



export default function UsersPage() {
    const { data: session } = authClient.useSession();
    const role = session?.user.role as Roles;

    const canView = can(role, PERMISSIONS.users.view);

      return (
        <>
        {canView &&
          <UsersContent role={role} />
        }
        </>
      )
   
}