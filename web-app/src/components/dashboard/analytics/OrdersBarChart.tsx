import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../Card";
import CustomTooltip from "@/components/global/CustomTooltip";
import { rangeDataType } from "@/types/orderType";

interface DataProps{
    data:rangeDataType[],
    range:string,
}
export default function OrdersBarChart({data,range}:DataProps) { 


    return(
        <Card title={"Order Per Peroid"} action={""}>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={range === "90D" ? 28 : 14}>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip active={"yyy"} payload={[]} label={"hhdh"} />} />
                      <Bar dataKey="orders" fill="#7c3aed" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
    )
}