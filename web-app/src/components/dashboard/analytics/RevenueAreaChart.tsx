import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../Card";
import CustomTooltip from "@/components/global/CustomTooltip";
import { rangeDataType } from "@/types/orderType";
interface DataProps{
    data:rangeDataType[],
}
export default function RevenueAreaChart({data}:DataProps) {
    return(
         <Card
                title="Revenue over time"
                action={'USD'}
              >
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip content={<CustomTooltip active={""} payload={[]} label={""} />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#7c3aed"
                      strokeWidth={2}
                      fill="url(#revGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
    )
}