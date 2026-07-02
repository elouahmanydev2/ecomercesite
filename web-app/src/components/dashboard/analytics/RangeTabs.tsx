export default function RangeTabs({ value, onChange }:any) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/8 bg-white/4 p-1" style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.04)" }}>
      {["7D", "30D", "90D"].map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={[
            "rounded-md px-3 py-1 text-xs font-medium transition-colors",
            value === r ? "bg-violet-600 text-white" : "text-white/40 hover:text-white/70",
          ].join(" ")}
        >
          {r}
        </button>
      ))}
    </div>
  );
}