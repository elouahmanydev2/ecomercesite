import Link from "next/link";

interface NAProps{
    href:string;
    active:boolean;
    Icon:any;
    label:string;
    pending:boolean;
    newOrdersCount:number;
    onClose:()=>void

}
export function NavSideItem({href,active,Icon,label,newOrdersCount,pending,onClose}:NAProps) {
    return(
        <Link
                key={href}
                href={href}
                onClick={onClose}
                className={[
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                    : "text-white/45 hover:text-white/80 hover:bg-white/5",
                ].join(" ")}
              >
                <Icon size={17} />
                {label}
                {label === "Orders" && (
                  <span className="ml-auto rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-violet-300">
                    {pending ? <></>: <> {newOrdersCount}</>}
                  </span>
                )}
              </Link>
    )
}