export default function DeleteStoreBtn() {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-5">
      <h3 className="mb-1 text-sm font-semibold text-red-400">Danger zone</h3>
      <p className="mb-4 text-xs text-white/35">
        Permanently delete your store and all associated data. This can't be
        undone.
      </p>
      <button className="rounded-lg border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
        Delete store
      </button>
    </div>
  );
}
