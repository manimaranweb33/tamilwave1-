import { Breadcrumbs } from "@/components/breadcrumbs";

export function InfoPage({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return <div className="shell py-8"><Breadcrumbs items={[{ label: title }]} /><div className="max-w-3xl"><p className="text-[10px] font-black uppercase tracking-[.2em] text-wave">{eyebrow}</p><h1 className="mt-2 text-3xl font-black">{title}</h1><div className="mt-6 space-y-4 text-sm leading-7 text-zinc-400">{children}</div></div></div>;
}
