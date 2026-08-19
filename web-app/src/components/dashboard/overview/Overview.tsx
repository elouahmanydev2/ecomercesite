//
'use client'
import { ACTIONS } from "@/lib/utils/constants";
import Link from "next/link";
import StatCard from "../global/StatCard";
import OrderItem from "../orders/OrderItem";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect} from "react";
import { fetchDashboard } from "@/lib/store/features/dashboard/thunks/dashboardThunks";

export default function Overview() {

  const dispatch = useAppDispatch();

  const {
    revenue,
    orderCount,
    productCount,
    recentOrders,
    pending,
  } = useAppSelector((state) => state.dashboard.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Good morning, Jane 👋</h2>
        <p className="mt-1 text-sm text-white/40">Here's what's happening with your store today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

        <StatCard label="Revenue" value={revenue.toFixed(2)} change={""} positive={false} />
        <StatCard label="Orders" value={orderCount} change={""} positive={false} />
        <StatCard label="Products" value={productCount} change={""} positive={false} />
      </div>

      {/* Quick actions */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Quick actions</p>
        <div className="flex flex-wrap gap-3">
          {ACTIONS.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="inline-flex items-center gap-2 rounded-lg border border-white/8 bg-white/4 px-4 py-2.5 text-sm font-medium text-white/70 hover:border-violet-500/30 hover:text-white transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.04)" }}
            >
              <span>{a.emoji}</span>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Recent orders</p>
          <Link href="/dashboard/orders" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
            View all →
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/7" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-4 py-3 text-xs font-medium text-white/30">Order</th>
                <th className="px-4 py-3 text-xs font-medium text-white/30">Customer</th>
                <th className="px-4 py-3 text-xs font-medium text-white/30">Amount</th>
                <th className="px-4 py-3 text-xs font-medium text-white/30">Date</th>
                <th className="px-4 py-3 text-xs font-medium text-white/30">Status</th>
              </tr>
            </thead>
            <tbody>
              {pending ? <><tr><td>loading..</td></tr></> :
                recentOrders
                .map((order ) => (
                  <OrderItem
                    key={order.id}
                    order={order}       
                   />
                ))
                }

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}