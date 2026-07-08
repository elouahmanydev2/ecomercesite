import { OrderStatus } from "@/generated/prisma/enums";

export type orderType = {
    id: string;
    customer: string;
    email?: string;
    amount: number;
    status: OrderStatus;
    createdAt?: string;

  product: {
    id: string;
    name: string;
    images: string[];
  };
}

export type rangeDataType={
 date: string;
 revenue: number;
 orders: number;
}
