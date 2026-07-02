"use client";

import Order from "@/components/dashboard/orders/OrderItem";
import { ALL_ORDERS } from "@/lib/utils/constants";
import { useState } from "react";


export default function OrdersContent() {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? ALL_ORDERS : ALL_ORDERS.filter((o) => o.status === filter);

  const totals = {
    revenue: ALL_ORDERS.filter((o) => o.status === "Paid").reduce((sum, o) => sum + parseFloat(o.amount.replace("$", "")), 0),
    paid: ALL_ORDERS.filter((o) => o.status === "Paid").length,
    pending: ALL_ORDERS.filter((o) => o.status === "Pending").length,
  };

  return (
    <div className="max-w-5xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Orders</h2>
          <p className="mt-0.5 text-sm text-white/40">{ALL_ORDERS.length} orders total</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M4 7h6M6 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          Export CSV
        </button>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5">
          <p className="text-xs text-emerald-400/70">Total revenue</p>
          <p className="text-lg font-bold text-emerald-400">${totals.revenue}</p>
        </div>
        <div className="rounded-lg border border-white/7 bg-white/3 px-4 py-2.5" style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.03)" }}>
          <p className="text-xs text-white/30">Paid orders</p>
          <p className="text-lg font-bold text-white">{totals.paid}</p>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5">
          <p className="text-xs text-amber-400/70">Pending</p>
          <p className="text-lg font-bold text-amber-400">{totals.pending}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 border-b border-white/5">
        {["All", "Paid", "Pending", "Refunded"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
              filter === f ? "border-violet-500 text-violet-400" : "border-transparent text-white/40 hover:text-white/70",
            ].join(" ")}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-white/7" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-4 py-3 text-left text-xs font-medium text-white/30">Order</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/30">Customer</th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-white/30">Product</th>
              <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-white/30">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/30">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/30">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, i) => (
                <Order 
                key={o.id}
                 id={o.id}
                 customer={o.customer} 
                 email={o.email}
                 product={o.product} 
                 date={o.date}
                 amount={o.amount} 
                 status={o.status}                
                />
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-14 text-center text-sm text-white/30">No {filter.toLowerCase()} orders yet.</div>
        )}
      </div>
    </div>
  );
}