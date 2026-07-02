interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export default function SectionSetting({ title, children }:SectionProps) {
  return (
    <div className="rounded-xl border border-white/7 bg-white/2" style={{ borderColor: "hsla(0, 1%, 15%, 0.00)", backgroundColor: "hsla(177, 80%, 42%, 0.02)" }}>
      <div className="border-b border-white/5 px-5 py-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
    </div>
  );
}