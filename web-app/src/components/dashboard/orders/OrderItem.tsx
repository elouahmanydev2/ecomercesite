import {ORDER_STATUS_STYLE} from "@/lib/utils/constants";
import { orderType } from "@/types/orderType";


interface OrderProps{
  order:orderType,

}

export default function OrderItem({order}:OrderProps) {
  
  if (!order) return null
  return (
    <tr
      key={order.id}
      className={`hover:bg-white/2 transition-colors`}
      style={{ borderColor: "rgba(255,255,255,0.05)" }}
    >
      <td className="px-4 py-3 font-mono text-xs text-white/50">#{order.id.slice(9)}</td>
      <td className="px-4 py-3.5">
        {order.customer && <p className="text-white/85 font-medium">{order.customer}</p>}
        {order.email &&  <p className="text-xs text-white/30">{order.email}</p>}                 
       </td> 
      {order.product.name && <td className="hidden sm:table-cell px-4 py-3 text-white/50">
        {order.product.name}
      </td>}
      {order.createdAt && <td className="hidden sm:table-cell px-4 py-3.5 text-white/40 text-xs">{order.createdAt}</td>}
      {order.amount && <td className="px-4 py-3 font-medium text-white">{order.amount}</td>}
      
      {order.status && <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${ORDER_STATUS_STYLE[order.status]}`}
        >
          {order.status}
        </span>
      </td>}
      
    </tr>
  );
}
