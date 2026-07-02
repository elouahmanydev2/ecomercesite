import { ACTIONS, ALL_ORDERS} from "@/lib/utils/constants";
import Link from "next/link";
import StatCard from "../StatCard";
import OrderItem from "../orders/OrderItem";

export default function Overview() {
  return (
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Good morning, Jane 👋</h2>
        <p className="mt-1 text-sm text-white/40">Here's what's happening with your store today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Revenue" value="$1,248" change="12%" positive />
        <StatCard label="Orders" value="34" change="8%" positive />
        <StatCard label="Products" value="12" change="2%" positive />
        <StatCard label="Store visits" value="892" change="3%" positive={false} />
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
                <th className="hidden sm:table-cell px-4 py-3 text-xs font-medium text-white/30">Product</th>
                <th className="px-4 py-3 text-xs font-medium text-white/30">Amount</th>
                <th className="px-4 py-3 text-xs font-medium text-white/30">Status</th>
              </tr>
            </thead>
            <tbody>
              {ALL_ORDERS.slice(0,6).map((o)=>(
              <OrderItem 
                key={o.id}
                id={o.id} 
                customer={o.customer} 
                product={o.product} 
                amount={o.amount} 
                status={o.status}  />
              ))

              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}