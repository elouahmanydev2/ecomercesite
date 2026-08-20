// import { Roles } from "@/generated/prisma/enums";

import { Roles } from "@/generated/prisma/enums";

export function can(
  role: Roles,
  allowed: Roles[]
) {
  return allowed.includes(role);
}