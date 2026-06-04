import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="mb-6 flex items-center gap-1.5 text-xs text-zinc-500">
      <Link className="hover:text-wave" href="/"><Home className="h-3.5 w-3.5" /></Link>
      {items.map((item) => <span className="flex items-center gap-1.5" key={item.label}><ChevronRight className="h-3 w-3 text-zinc-700" />{item.href ? <Link className="hover:text-wave" href={item.href}>{item.label}</Link> : <span className="text-zinc-300">{item.label}</span>}</span>)}
    </div>
  );
}
