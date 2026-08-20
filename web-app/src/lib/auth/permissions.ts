import { Roles } from "@/generated/prisma/enums";

export const PERMISSIONS = {
  dashboard: [
    Roles.super_admin,
    Roles.admin,
    Roles.manager,
    Roles.editor,
    Roles.support,
  ],

  users: {
    view: [Roles.super_admin, Roles.admin],
    create: [Roles.super_admin, Roles.admin],
    edit: [Roles.super_admin, Roles.admin],
    delete: [Roles.super_admin],
  },

  products: {
    view: [
      Roles.super_admin,
      Roles.admin,
      Roles.manager,
      Roles.editor,
    ],

    create: [
      Roles.super_admin,
      Roles.admin,
      Roles.manager,
      Roles.editor,
    ],

    edit: [
      Roles.super_admin,
      Roles.admin,
      Roles.manager,
      Roles.editor,
    ],

    delete: [
      Roles.super_admin,
      Roles.admin,
    ],
  },

  orders: {
    view: [
      Roles.super_admin,
      Roles.admin,
      Roles.manager,
      Roles.support,
    ],

    update: [
      Roles.super_admin,
      Roles.admin,
      Roles.manager,
      Roles.support,
    ],

    delete: [
      Roles.super_admin,
    ],
  },
};