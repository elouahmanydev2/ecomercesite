export function TopBar() {
    return(
         <div className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <a href="/products" className="text-sm text-white/40 hover:text-white transition-colors">
            ← All products
          </a>
        </div>
      </div>
    )
}