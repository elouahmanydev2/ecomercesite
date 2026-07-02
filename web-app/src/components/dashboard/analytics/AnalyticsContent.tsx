"use client";

import OrdersBarChart from "@/components/dashboard/analytics/OrdersBarChart";
import RangeTabs from "@/components/dashboard/analytics/RangeTabs";
import RevenueAreaChart from "@/components/dashboard/analytics/RevenueAreaChart";
import TopProducts from "@/components/dashboard/analytics/TopProducts";
import TrafficSources from "@/components/dashboard/analytics/TrafficSources";
import StatCard from "@/components/dashboard/StatCard";
import { RANGE_DATA, TOP_PRODUCTS, TRAFFIC } from "@/lib/utils/constants";
import { useState } from "react";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsContent() {
  const [range, setRange] = useState("30D");
  const data = RANGE_DATA[range];
  console.log(data);

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Analytics</h2>
          <p className="mt-0.5 text-sm text-white/40">
            Track your store's performance over time.
          </p>
        </div>
        <RangeTabs value={range} onChange={setRange} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Revenue"
          value="$2,061"
          change="18%"
          positive
          sub="vs prev period"
        />
        <StatCard
          label="Orders"
          value="69"
          change="11%"
          positive
          sub="vs prev period"
        />
        <StatCard label="Avg. order" value="$29.87" change="6%" positive />
        <StatCard
          label="Store visits"
          value="892"
          change="4%"
          positive={false}
          sub="vs prev period"
        />
      </div>

      {/* Revenue area chart */}

      <RevenueAreaChart data={data} />

      {/* Orders bar chart + traffic */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Orders bar chart */}

        <OrdersBarChart data={data} range={""} />
        {/* Traffic sources */}

        <TrafficSources T={TRAFFIC} />
      </div>

      {/* Top products */}
      <TopProducts topproducts={TOP_PRODUCTS} />
    </div>
  );
}
