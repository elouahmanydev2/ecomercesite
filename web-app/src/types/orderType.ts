export type orderType = {
    id: string;
    customer: string;
    email?: string;
    product: string;
    amount: string;
    status: string;
    date?: string;
}

export type rangeDataType={
 date: string;
 revenue: number;
 orders: number;
}