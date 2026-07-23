import { z } from "zod";

export const rangeQuerySchema = z.object({
  range: z.enum(["7D", "30D", "90D"]).default("30D"),
});

export type RangeQueryInput = z.infer<typeof rangeQuerySchema>;

export interface AnalyticsResponse {
  summary: {
    revenue: number;
    revenueChange: number;
    orders: number;
    ordersChange: number;
    avgOrderValue: number;
    avgOrderValueChange: number;
  };
  chartData: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    revenue: number;
    sales: number;
    pct: number;
  }>;
}