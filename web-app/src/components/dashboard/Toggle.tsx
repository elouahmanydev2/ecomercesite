import { useState } from "react";

interface ToggleProps {
  label: string;
  desc?: string; 
  defaultOn?: boolean;
}

export default function Toggle({ label, desc, defaultOn = false }: ToggleProps) {
  const [on, setOn] = useState(defaultOn);

  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-white/5 last:border-0">
      <div className="flex flex-col gap-0.5">
        <label className="text-sm font-medium text-zinc-200 select-none cursor-pointer" onClick={() => setOn(!on)}>
          {label}
        </label>
        {desc && <p className="text-xs text-zinc-500 leading-normal">{desc}</p>}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn(!on)}
        className={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
          ${on ? "bg-violet-600" : "bg-zinc-800"}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 
            transition duration-200 ease-in-out
            ${on ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
}