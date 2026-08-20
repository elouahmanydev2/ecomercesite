import { ProductType } from "@/types/productType";
import { useState } from "react";

interface Props{
    product:ProductType
}
export function ProductPreview({product}:Props) {
    const [preview,setPreview] = useState(1)
      const thumbnail  = product?.images?.[preview] ?? null;
    return(
        <div>
            <div className="mb-4 flex h-80 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/7 bg-white/4"
              style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.04)" }}>
              {thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbnail} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-7xl">📦</span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img:string, i:number) => (
                  <div key={i}
                  onClick={()=>setPreview(i)}
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border ${
                      i === preview ? "border-violet-500" : "border-white/10"
                    }`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
    )
}