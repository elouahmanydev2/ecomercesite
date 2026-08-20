// src/components/dashboard/orders/OrderItem.tsx
import { OrderStatus } from "@/generated/prisma/enums";
import { ORDER_STATUS_STYLE } from "@/lib/utils/constants";
import { OrderType } from "@/types/orderType";

interface OrderProps {
  order: OrderType;
  onEdit?: (order: OrderType) => void;
}

function formatDate(value?: string | Date) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function OrderItem({ order, onEdit }: OrderProps) {
  if (!order) return null;
  
  return (
    <tr
      className="border-b border-white/5 hover:bg-white/2 transition-colors last:border-0"
    >
      {/* Order ID */}
      <td className="px-4 py-3 font-mono text-xs text-white/50">
        #{order.id ? order.id.slice(-8) : "—"}
      </td>

      {/* Customer */}
      <td className="px-4 py-3.5">
        <p className="font-medium text-white/85">{order.customer}</p>
        {order.email && (
          <p className="text-xs text-white/30">{order.email}</p>
        )}
      </td>

   
      {/* Amount */}
      <td className="px-4 py-3 font-medium text-white">
        {formatAmount(order.amount)}
      </td>

      {/* Date */}
      <td className="hidden md:table-cell px-4 py-3.5 text-white/40 text-xs">
        {formatDate(order.createdAt)}
      </td>


      {/* Status */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${
            ORDER_STATUS_STYLE[order.status as OrderStatus] ??
            "bg-white/5 text-white/40 border-white/10"
          }`}
        >
          {order.status}
        </span>
      </td>

      {/* Edit action — always render the cell for stable column count */}
      {onEdit && (
        <td className="px-4 py-3 text-right">
          <button
            onClick={() => onEdit(order)}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/10 transition"
          >
            Edit
          </button>

        </td>
      )

      }
   
    </tr>
  );
}