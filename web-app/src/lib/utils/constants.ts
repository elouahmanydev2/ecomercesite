// ─── Recent Orders ────────────────────────────────────────────────────────────

import { OrderStatus } from "@/generated/prisma/enums";
import { rangeDataType } from "@/types/orderType";

export const ALL_ORDERS = [
  { id: "#1042", customer: "Alex M.",   email: "alex@example.com",   product: "Design Preset Pack",     amount: "$29", status: "Paid",     date: "Jun 24" },
  { id: "#1041", customer: "Sara L.",   email: "sara@example.com",   product: "Brand Kit Vol.2",        amount: "$49", status: "Paid",     date: "Jun 23" },
  { id: "#1040", customer: "Jordan P.", email: "jordan@example.com", product: "Sample Pack — Lo-fi",    amount: "$15", status: "Pending",  date: "Jun 23" },
  { id: "#1039", customer: "Mia R.",    email: "mia@example.com",    product: "Design Preset Pack",     amount: "$29", status: "Paid",     date: "Jun 22" },
  { id: "#1038", customer: "Theo K.",   email: "theo@example.com",   product: "Icon Set 3.0",           amount: "$19", status: "Refunded", date: "Jun 21" },
  { id: "#1037", customer: "Chloe V.", email: "chloe@example.com",   product: "Lightroom Presets",      amount: "$39", status: "Paid",     date: "Jun 20" },
  { id: "#1036", customer: "Alex M.",   email: "alex@example.com",   product: "Design Preset Pack",     amount: "$29", status: "Paid",     date: "Jun 24" },
  { id: "#1035", customer: "Sara L.",   email: "sara@example.com",   product: "Brand Kit Vol.2",        amount: "$49", status: "Paid",     date: "Jun 23" },
  { id: "#1034", customer: "Jordan P.", email: "jordan@example.com", product: "Sample Pack — Lo-fi",    amount: "$15", status: "Pending",  date: "Jun 23" },
  { id: "#1033", customer: "Mia R.",    email: "mia@example.com",    product: "Design Preset Pack",     amount: "$29", status: "Paid",     date: "Jun 22" },
  { id: "#1032", customer: "Theo K.",   email: "theo@example.com",   product: "Icon Set 3.0",           amount: "$19", status: "Refunded", date: "Jun 21" },
  { id: "#1031", customer: "Chloe V.", email: "chloe@example.com",   product: "Lightroom Presets",      amount: "$39", status: "Paid",     date: "Jun 20" },


];
export const STATUS_STYLE:Record<string,string> = {
  Paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" as string,
  Pending: "bg-amber-500/15 text-amber-400 border-amber-500/20" as string,
  Refunded: "bg-red-500/15 text-red-400 border-red-500/20" as string,
};
export const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  PAID: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  SHIPPED: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  DELIVERED: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  CANCELLED: "bg-red-500/15 text-red-400 border-red-500/20",
};
// ─── Quick actions ─────────────────────────────────────────────────────────────

export const ACTIONS = [
  { label: "Add product", href: "/dashboard/products", emoji: "📦" },
  { label: "Copy store link", href: "#", emoji: "🔗" },
  { label: "View orders", href: "/dashboard/orders", emoji: "📋" },
];
// ─── Data ─────────────────────────────────────────────────────────────────────

export const PRODUCTS = [
  { id: 1, name: "Design Preset Pack", price: "$29", sales: 18, status: "Active", emoji: "🎨" },
  { id: 2, name: "Brand Kit Vol.2", price: "$49", sales: 9, status: "Active", emoji: "📐" },
  { id: 3, name: "Sample Pack — Lo-fi", price: "$15", sales: 24, status: "Active", emoji: "🎵" },
  { id: 4, name: "Icon Set 3.0", price: "$19", sales: 6, status: "Draft", emoji: "✏️" },
  { id: 5, name: "Lightroom Presets", price: "$39", sales: 0, status: "Draft", emoji: "📷" },
];

export const STATUS_STYLE_PRODUCT:Record<string,string> = {
  Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Draft:  "bg-white/5 text-white/40 border-white/10",
};
export type PRODUCTPAGEPATH = keyof typeof STATUS_STYLE_PRODUCT;

export const TOP_PRODUCTS = [
  { name: "Design Preset Pack", revenue: 522, sales: 18, pct: 85 },
  { name: "Sample Pack — Lo-fi", revenue: 360, sales: 24, pct: 65 },
  { name: "Brand Kit Vol.2",    revenue: 441, sales: 9,  pct: 55 },
  { name: "Icon Set 3.0",       revenue: 114, sales: 6,  pct: 25 },
  { name: "Lightroom Presets",  revenue: 78,  sales: 2,  pct: 14 },
];


// ------Traffic source-------------------------------------------------------------

export const TRAFFIC = [
  { source: "Instagram",  visits: 412, pct: 46 },
  { source: "Direct link", visits: 274, pct: 31 },
  { source: "TikTok",     visits: 142, pct: 16 },
  { source: "Twitter / X", visits: 64,  pct: 7 },
];

// ───Analytics Data ─────────────────────────────────────────────────────────────────────

export const REVENUE_30D = [
  { date: "Jun 1",  revenue: 48,  orders: 2 },
  { date: "Jun 3",  revenue: 92,  orders: 4 },
  { date: "Jun 5",  revenue: 29,  orders: 1 },
  { date: "Jun 7",  revenue: 134, orders: 5 },
  { date: "Jun 9",  revenue: 87,  orders: 3 },
  { date: "Jun 11", revenue: 210, orders: 7 },
  { date: "Jun 13", revenue: 156, orders: 5 },
  { date: "Jun 15", revenue: 98,  orders: 3 },
  { date: "Jun 17", revenue: 245, orders: 8 },
  { date: "Jun 19", revenue: 182, orders: 6 },
  { date: "Jun 21", revenue: 310, orders: 10 },
  { date: "Jun 23", revenue: 278, orders: 9 },
  { date: "Jun 24", revenue: 193, orders: 6 },
];

export const REVENUE_7D = REVENUE_30D.slice(-5);
export const REVENUE_90D = [
  { date: "Apr",  revenue: 820,  orders: 28 },
  { date: "May",  revenue: 1340, orders: 44 },
  { date: "Jun",  revenue: 2061, orders: 69 },
];

export const RANGE_DATA:Record<string,rangeDataType[]> = { "7D": REVENUE_7D, "30D": REVENUE_30D, "90D": REVENUE_90D };

export const NAV_LINKS = ["Features", "Pricing", "Testimonials", "Blog"];
