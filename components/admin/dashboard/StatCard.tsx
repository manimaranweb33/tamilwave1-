export function StatCard({
  label,
  published,
  draft
}: {
  label: string;
  published: number;
  draft: number;
}) {
  return (
    <div className="rounded-xl border border-line bg-panel p-5">
      <p className="text-[10px] font-black uppercase tracking-[.18em] text-wave">{label}</p>
      <p className="mt-2 text-3xl font-black">{published}</p>
      <p className="mt-1 text-xs text-zinc-500">published</p>
      <p className="mt-2 text-sm text-zinc-600">{draft} drafts</p>
    </div>
  );
}
