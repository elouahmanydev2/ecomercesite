import { ProductStatus } from "@/generated/prisma/enums";
import { ChangeEvent } from "react";

interface Props {
  status: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  labelClass: string;
  inputClass: string;
}

export default function StatusField({
  status,
  onChange,
  labelClass,
  inputClass,
}: Props) {
  return (
    <div>
      <label className={labelClass}>Status</label>

      <select
        name="status"
        value={status}
        className={`${inputClass} cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%2024%27%20fill=%27none%27%20stroke=%27%23a1a1aa%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%276%209%2012%2015%2018%209%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
        onChange={onChange}
      >
        {Object.values(ProductStatus).map((statusValue) => (
          <option
            key={statusValue}
            value={statusValue}
            className="bg-zinc-900 text-zinc-200 py-1"
          >
            {statusValue}
          </option>
        ))}
      </select>
    </div>
  );
}