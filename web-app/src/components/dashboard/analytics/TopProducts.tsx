import { TopProductType } from "@/types/productType";
import Card from "../global/Card";

interface TopProductsProps {
  topproducts:TopProductType[]
}
export default function TopProducts({topproducts}:TopProductsProps) {
    return(
         <Card title={"Top products by revenue"} action={""} >
        <div className="space-y-3">
          {topproducts.map((p, i) => (
            <div key={p.name} className="flex items-center gap-4">
              <span className="w-4 shrink-0 text-xs font-semibold text-white/20">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex items-center justify-between">
                  <span className="truncate text-sm text-white/75 font-medium">{p.name}</span>
                  <span className="ml-3 shrink-0 text-sm font-semibold text-white">${p.revenue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-full rounded-full bg-orange-500/70 transition-all duration-500"
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-xs text-white/30">{p.sales} sold</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
}