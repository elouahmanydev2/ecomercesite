import { ProductStatus } from "@/generated/prisma/enums";
import { useEffect, useState } from "react";
import AddProductBtn from "../buttons/AddProductBtn";
import EditProductBtn from "../buttons/EditProductBtn";

interface AddModalProps {
  onClose: () => void;
  productId?:string;
  

}

export default function ProductModal({ onClose ,productId }: AddModalProps) {
    const [update ,setUpdate] = useState(false)
    useEffect(()=>{
        if (productId) {
            setUpdate(true)
        }
    },[productId])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
        <h3 className="mb-5 text-base font-semibold text-white">
          Add Product
        </h3>

        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Nike Air Max"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="99.99"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none"
            />
          </div>

          {/* Images */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">
              Image URLs
            </label>
            <textarea
              rows={3}
              placeholder="One image URL per line..."
              className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none"
            />
            <p className="mt-1 text-xs text-white/30">
              Enter one image URL per line.
            </p>
          </div>

          {/* Sales */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">
              Sales
            </label>
            <input
              type="number"
              min={0}
              placeholder="0"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">
              Status
            </label>
            <select
              defaultValue={ProductStatus.Draft}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-violet-500/50 focus:outline-none"
            >
              {Object.values(ProductStatus).map((status) => (
                <option
                  key={status}
                  value={status}
                  className="bg-[#111] text-white"
                >
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            Cancel
          </button>

          {update ? <EditProductBtn /> : <AddProductBtn /> }
        </div>
      </div>
    </div>
  );
}