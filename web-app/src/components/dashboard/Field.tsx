interface FieldProps {
  label: string;
  defaultValue: string | number;
  hint?: string | number;
  type: string;
}
export default function Field({ label, defaultValue, type, hint }:FieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-white/50">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none transition-colors"
      />
      {hint && <p className="mt-1 text-xs text-white/25">{hint}</p>}
    </div>
  );
}