"use client";

import { useEffect, useState } from "react";
import { OrderStatus } from "@/generated/prisma/enums";
import { useAppDispatch } from "@/hooks/hooks";
import { updateOrder } from "@/lib/store/features/dashboard/orders/thunks/ordersThunks";
import { OrderItemType } from "@/types/orderType";

interface Props {
  open: boolean;
  orderId: string;
  currentStatus: OrderStatus;
  items: OrderItemType[];
  note?: string;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditOrderDrawer({
  open,
  orderId,
  currentStatus,
  items,
  note,
  onClose,
  onUpdated,
}: Props) {
  const dispatch = useAppDispatch()

  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);


  async function save() {
    setLoading(true);

    dispatch(updateOrder({
      id: orderId,
      status
    }))

    setLoading(false);

    onUpdated();
    onClose();

  }
  useEffect(() => {
    if (open) {
      setStatus(currentStatus);      
    }
  }, [open, currentStatus]);
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-[#101010] border-l border-white/10 z-50 p-6">

        <h2 className="text-xl font-semibold text-white mb-6">
          Edit Order
        </h2>

        <label className="block text-sm text-white/70 mb-2">
          Status
        </label>


        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="w-full rounded-lg bg-[#181818] border border-white/10 p-3 text-white"
        >
          {Object.values(OrderStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>


        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 py-3 text-white"
          >
            Cancel
          </button>

          <button
            onClick={save}
            disabled={loading}
            className="flex-1 rounded-lg bg-white text-black py-3"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
        {/* items */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
            Ordered Items
          </h3>

          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-[#171717] p-4"
            >
              <div className="flex gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-white/5">
                  {item.product?.images?.length ? (
                    <img
                      src={item.product.images[item.product.thumbnail]}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl">
                      📦
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-white">
                    {item.product?.name}
                  </h3>
                   <div className="flex flex-col items-start">
                          <p className="truncate text-sm font-medium text-white">{item.product?.name}</p>
                          {item.variant && (
                            <p className="text-xs text-white/40 truncate">{`${item.variant.title}`}</p>
                          )}
                        </div>  

                  <p className="mt-1 text-xs text-white/40">
                    Unit Price
                  </p>

                  <p className="text-sm text-white">
                    ${(item.priceCents / 100).toFixed(2)}
                  </p>
                </div>

                <div className="text-right">
                  <div className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
                    × {item.quantity}
                  </div>

                  <p className="mt-3 font-bold text-white">
                    ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#171717] p-4 mt-2">
          <p className="mb-2 text-xs uppercase tracking-wider text-white/40">
            Customer Note
          </p>

          <p className="text-sm leading-relaxed text-white/80">
            {note || "No note provided."}
          </p>
        </div>
      </div>
    </>
  );
}