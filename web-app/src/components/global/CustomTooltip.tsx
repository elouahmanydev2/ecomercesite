// ─── Custom tooltip ───────────────────────────────────────────────────────────

interface CustomTooltipProps{
  active:string;
  payload:any[];
  label:string;
};
export default function CustomTooltip({ active, payload, label }:CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2.5 shadow-xl text-xs">
      <p className="mb-1 font-medium text-white/50">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.dataKey === "revenue" ? `$${p.value}` : `${p.value} orders`}
        </p>
      ))}
    </div>
  );
}