// src/app/dashboard/orders/OrdersContent.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { OrderStatus } from "@/generated/prisma/enums";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchOrders } from "@/lib/features/orders/thunks/ordersThunks";
import OrderItem from "@/components/dashboard/orders/OrderItem";
import EditOrderDrawer from "./EditOrderDrawer";
import { OrderType } from "@/types/orderType";

export default function OrdersContent() {
  const dispatch = useAppDispatch();
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");

  const { orders, loading, error } = useAppSelector(
    (state) => state.dashboard.orders
  );

  useEffect(() => {
    dispatch(fetchOrders());
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
        { revenue: 0, paid: 0, pending: 0, shipped: 0, delivered: 0, cancelled: 0 }
      ),
    [orders]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-white/40">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="text-sm">Loading orders…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
        {/* error is always a string now thanks to toErrorMessage in the slice */}
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Orders</h2>
          <p className="mt-0.5 text-sm text-white/40">
            {orders.length} order{orders.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/60 transition-colors hover:text-white">
          Export CSV
        </button>
      </div>

      {/* Summary pills */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Revenue", value: `$${totals.revenue.toFixed(2)}`, color: "emerald" },
          { label: "Paid",      value: totals.paid,      color: "emerald" },
          { label: "Pending",   value: totals.pending,   color: "amber"   },
          { label: "Shipped",   value: totals.shipped,   color: "blue"    },
          { label: "Delivered", value: totals.delivered, color: "violet"  },
          { label: "Cancelled", value: totals.cancelled, color: "red"     },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className={`rounded-lg border border-${color}-500/20 bg-${color}-500/10 p-4`}
          >
            <p className={`text-xs text-${color}-400/70`}>{label}</p>
            <p className={`text-xl font-bold text-${color}-400`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        {(["All", ...Object.values(OrderStatus)] as ("All" | OrderStatus)[]).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                filter === status
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-xs font-medium text-white/40">Order</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/40">Customer</th>
              {/* Match the hidden sm: on the td */}
              <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-white/40">Amount</th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-white/40">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/40">Status</th>
              {/* Edit column — always rendered for stable column count */}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <OrderItem key={order.id} order={order} onEdit={setSelectedOrder} />
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-white/40">
            No {filter !== "All" ? filter.toLowerCase() : ""} orders found.
          </div>
        )}
      </div>

      <EditOrderDrawer
        open={!!selectedOrder}
        orderId={selectedOrder?.id ?? ""}
        currentStatus={selectedOrder?.status ?? OrderStatus.PENDING}
        onClose={() => setSelectedOrder(null)}
        onUpdated={() => dispatch(fetchOrders())} 
        items={selectedOrder?.items || []} 
        note={selectedOrder?.note}
        
        />
    </div>
  );
}