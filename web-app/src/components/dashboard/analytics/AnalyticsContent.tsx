"use client";

import { useEffect, useState } from "react";
import OrdersBarChart from "@/components/dashboard/analytics/OrdersBarChart";
import RangeTabs from "@/components/dashboard/analytics/RangeTabs";
import RevenueAreaChart from "@/components/dashboard/analytics/RevenueAreaChart";
import TopProducts from "@/components/dashboard/analytics/TopProducts";
import TrafficSources from "@/components/dashboard/analytics/TrafficSources";
import StatCard from "@/components/dashboard/global/StatCard";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { TRAFFIC } from "@/lib/utils/constants";
import { fetchAnalyticsData } from "@/lib/store/features/dashboard/analytics/thunks/analyticsThunks";

export default function AnalyticsContent() {
  const dispatch = useAppDispatch();
  const [range, setRange] = useState("30D");

  const { data, status, error } = useAppSelector((state) => state.dashboard.analytics);

  useEffect(() => {
    dispatch(fetchAnalyticsData(range));
  }, [dispatch, range]);

  if (status === "loading" && !data) {
    return <div className="p-8 text-white/60">Loading analytics...</div>;
  }

  if (status === "failed") {
    return <div className="p-8 text-red-400">Error: {error}</div>;
  }

  const summary = data?.summary;
  const chartData = data?.chartData || [];
  const topProducts = data?.topProducts || [];

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
        {/* Revenue */}
        <StatCard
          label="Revenue"
          value={`$${summary?.revenue ?? 0}`}
          change={`${summary?.revenueChange ?? 0}%`}
          positive={(summary?.revenueChange ?? 0) >= 0}
          sub="vs prev period"
        />

        {/* Orders */}
        <StatCard
          label="Orders"
          value={`${summary?.orders ?? 0}`}
          change={`${summary?.ordersChange ?? 0}%`}
          positive={(summary?.ordersChange ?? 0) >= 0}
          sub="vs prev period"
        />

        {/* Average order */}
        <StatCard
          label="Avg. order"
          value={`$${summary?.avgOrderValue ?? 0}`}
          change={`${summary?.avgOrderValueChange ?? 0}%`}
          positive={(summary?.avgOrderValueChange ?? 0) >= 0}
        />

        {/* Store visits */}
{/* 
        <StatCard
          label="Store visits"
          value="892"
          change="4%"
          positive={false}
          sub="vs prev period"
        />
         */}
      </div>

      {/* Revenue chart */}
      <RevenueAreaChart data={chartData} />

      {/* Orders + Traffic */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OrdersBarChart data={chartData} range={range} />
{/*         
        <TrafficSources T={TRAFFIC} /> */}
      </div>

      {/* Top products */}
      <TopProducts topproducts={topProducts} />
    </div>
  );
}