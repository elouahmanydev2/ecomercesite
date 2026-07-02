// ─── Section wrapper ──────────────────────────────────────────────────────────
interface CardProps{
title:string;
action:string;
children:React.ReactNode
}
export default function Card({ title, action, children }:CardProps) {
  return (
    <div
      className="rounded-xl border border-white/7"
      style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}
    >
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}