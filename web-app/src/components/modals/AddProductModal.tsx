interface AddModalProps {
  onClose: () => void; // Fixed 'any' type here
}
export default function AddProductModal({ onClose }:AddModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
        <h3 className="mb-5 text-base font-semibold text-white">Add product</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">Product name</label>
            <input className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none" placeholder="e.g. Design Preset Pack" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">Price (USD)</label>
            <input className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none" placeholder="29" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">Description</label>
            <textarea rows={3} className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none" placeholder="What's included…" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-white/50 hover:text-white transition-colors">Cancel</button>
          <button className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors">Save product</button>
        </div>
      </div>
    </div>
  );
}
