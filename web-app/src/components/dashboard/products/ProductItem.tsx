import { STATUS_STYLE_PRODUCT } from "@/lib/utils/constants";
import { ProductType } from "@/types/productType";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProductItem({
  id,
  name,
  images,
  price,
  sales,
  status,
  thumbnail
}: ProductType) {
  const router = useRouter()
  return (
    <tr key={id} className={"hover:bg-white/2 transition-colors"}>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          {/* <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-lg">
            {}
          </div> */}
          <Image
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-lg"
            width={9}
            height={9}
            src={images && images.length > 0
              ? images[Number(thumbnail) || 0]
              : ""
            }
            alt={name} />

          <span className="font-medium text-white">{name}</span>
        </div>
      </td>
      <td className="hidden sm:table-cell px-4 py-3.5 text-white/60">
        {price}
      </td>
      <td className="hidden sm:table-cell px-4 py-3.5 text-white/60">
        {sales} sold
      </td>
      <td className="px-4 py-3.5">
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLE_PRODUCT[status]}`}
        >
          {status}
        </span>
      </td>
      <td className="px-4 py-3.5 text-right">
        <button
          onClick={() => router.push(`/dashboard/products/${id}`)}
          className="rounded-md px-3 py-1.5 text-xs text-white/40 hover:bg-white/5 hover:text-white transition-colors">
          Edit
        </button>
      </td>
    </tr>
  );
}
