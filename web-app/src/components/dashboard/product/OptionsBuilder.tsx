"use client";

interface ProductOption {
  name: string;
  values: string[];
}

interface OptionsBuilderProps {
  options: ProductOption[];
  inputClass: string;
  addOption: () => void;
  removeOption: (index: number) => void;
  updateOptionName: (index: number, value: string) => void;
  updateOptionValues: (index: number, value: string) => void;
  generateVariants: () => void;
}

export default function OptionsBuilder({
  options,
  inputClass,
  addOption,
  removeOption,
  updateOptionName,
  updateOptionValues,
  generateVariants,
}: OptionsBuilderProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <h2 className="text-base font-semibold text-zinc-300">
          Options Builder
        </h2>

        <button
          type="button"
          onClick={addOption}
          className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-400 transition hover:bg-indigo-500/20 hover:text-indigo-300"
        >
          + Add Option
        </button>
      </div>

      {options.length === 0 ? (
        <p className="text-xs italic text-zinc-500">
          No options added yet. Add attributes such as Size or Color.
        </p>
      ) : (
        <div className="space-y-3">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 sm:flex-row sm:items-center"
            >
              <div className="w-full sm:w-1/3">
                <input
                  type="text"
                  placeholder="Option (e.g. Size)"
                  value={option.name}
                  onChange={(e) =>
                    updateOptionName(index, e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div className="flex w-full gap-2 sm:w-2/3">
                <input
                  type="text"
                  placeholder="Values: S, M, L"
                  value={option.values.join(", ")}
                  onChange={(e) =>
                    updateOptionValues(index, e.target.value)
                  }
                  className={inputClass}
                />

                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {options.length > 0 && (
        <button
          type="button"
          onClick={generateVariants}
          className="inline-flex w-full items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800 hover:text-white sm:w-auto"
        >
          🔄 Generate Variants
        </button>
      )}
    </section>
  );
}