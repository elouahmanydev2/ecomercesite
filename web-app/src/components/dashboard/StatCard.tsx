// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label?: string;
  value: string | number;
  change: string | number;
  positive: boolean;
  sub?:string;
}

export default function StatCard({ label, value, change, positive, sub }: StatCardProps) {
  return (
   <div
      className="rounded-xl border border-white/7 p-5"
      style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}
    >
      <p className="mb-1 text-xs font-medium text-white/40">{label}</p>
      <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        <span className={`text-xs font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}>
          {positive ? "↑" : "↓"} {change}
        </span>
        {sub && <span className="text-xs text-white/25">{sub}</span>}
      </div>
    </div>
  );
}