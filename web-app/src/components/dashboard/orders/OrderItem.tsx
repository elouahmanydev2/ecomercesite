import { PagePath, STATUS_STYLE } from "@/lib/utils/constants";
import { orderType } from "@/types/orderType";


export default function OrderItem({id,customer,email,product,amount,status,date}:orderType) {
  return (
    <tr
      key={id}
      className={`hover:bg-white/2 transition-colors`}
      style={{ borderColor: "rgba(255,255,255,0.05)" }}
    >
      <td className="px-4 py-3 font-mono text-xs text-white/50">{id}</td>
      <td className="px-4 py-3.5">
        {customer && <p className="text-white/85 font-medium">{customer}</p>}
        {email &&  <p className="text-xs text-white/30">{email}</p>}                 
       </td> 
      {product && <td className="hidden sm:table-cell px-4 py-3 text-white/50">
        {product}
      </td>}
      {date && <td className="hidden sm:table-cell px-4 py-3.5 text-white/40 text-xs">{date}</td>}
      {amount && <td className="px-4 py-3 font-medium text-white">{amount}</td>}
      
      {status && <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLE[status as PagePath]}`}
        >
          {status}
        </span>
      </td>}
      
    </tr>
  );
}
