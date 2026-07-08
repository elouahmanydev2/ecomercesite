"use client";

import OrderItem from "@/components/dashboard/orders/OrderItem";
import { OrderStatus } from "@/generated/prisma/enums";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchNewOrderCount, fetchOrders } from "@/lib/features/orders/thunks/ordersThunks";
import { useEffect, useMemo, useState } from "react";

export default function OrdersContent() {
  const dispatch = useAppDispatch();

  const { orders, ordersLoading, error } = useAppSelector(
    (state) => state.dashboard.orders
  );

  const [filter, setFilter] = useState<"All" | OrderStatus>("All");

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchNewOrderCount())
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (filter === "All") return orders;

    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  const totals = useMemo(
    () =>
      orders.reduce(
        (acc, order) => {
          switch (order.status) {
            case OrderStatus.PAID:
              acc.revenue += order.amount;
              acc.paid++;
              break;

            case OrderStatus.PENDING:
              acc.pending++;
              break;

            case OrderStatus.SHIPPED:
              acc.shipped++;
              break;

            case OrderStatus.DELIVERED:
              acc.delivered++;
              break;

            case OrderStatus.CANCELLED:
              acc.cancelled++;
              break;
          }

          return acc;
        },
        {
          revenue: 0,
          paid: 0,
          pending: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
        }
      ),
    [orders]
  );
if (ordersLoading) return <p>Loading orders...</p>;
if (error)
  return (
    <p>
      Error: {typeof error === "string" ? error : error}
    </p>
  );

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Orders</h2>
          <p className="mt-0.5 text-sm text-white/40">
            {orders.length} orders total
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/60 transition-colors hover:text-white">
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-xs text-emerald-400/70">Revenue</p>
          <p className="text-xl font-bold text-emerald-400">
            ${totals.revenue.toFixed(2)}
          </p>
        </div>

        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-xs text-emerald-400/70">Paid</p>
          <p className="text-xl font-bold text-emerald-400">
            {totals.paid}
          </p>
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
          <p className="text-xs text-amber-400/70">Pending</p>
          <p className="text-xl font-bold text-amber-400">
            {totals.pending}
          </p>
        </div>

        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
          <p className="text-xs text-blue-400/70">Shipped</p>
          <p className="text-xl font-bold text-blue-400">
            {totals.shipped}
          </p>
        </div>

        <div className="rounded-lg border border-violet-500/20 bg-violet-500/10 p-4">
          <p className="text-xs text-violet-400/70">Delivered</p>
          <p className="text-xl font-bold text-violet-400">
            {totals.delivered}
          </p>
        </div>

        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-xs text-red-400/70">Cancelled</p>
          <p className="text-xl font-bold text-red-400">
            {totals.cancelled}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        {[
          "All",
          OrderStatus.PAID,
          OrderStatus.PENDING,
          OrderStatus.SHIPPED,
          OrderStatus.DELIVERED,
          OrderStatus.CANCELLED,
        ].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as "All" | OrderStatus)}
            className={`rounded-lg px-4 py-2 text-sm transition ${
              filter === status
                ? "bg-violet-600 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-white/40">Order</th>
              <th className="px-4 py-3 text-left text-white/40">Customer</th>
              <th className="px-4 py-3 text-left text-white/40">Product</th>
              <th className="px-4 py-3 text-left text-white/40">Date</th>
              <th className="px-4 py-3 text-left text-white/40">Amount</th>
              <th className="px-4 py-3 text-left text-white/40">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-white/40">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
}