import { trafficType } from "@/types/trafficType";
import Card from "../Card";

interface TrafficProps {
    T:trafficType[]

}

export default function TrafficSources({T}:TrafficProps) {
  return (
    <Card title={"Traffic source"} action={""}>
      <div className="space-y-4">
        {T.map((t) => (
          <div key={t.source}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm text-white/70">{t.source}</span>
              <span className="text-xs font-medium text-white/45">
                {t.visits} visits
              </span>
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-white/8"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-500"
                style={{ width: `${t.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
