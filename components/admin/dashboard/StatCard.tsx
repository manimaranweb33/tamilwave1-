import Link from "next/link";

export function StatCard({
  label,
  published,
  draft,
  href,
  subtitle = "published"
}: {
  label: string;
  published: number;
  draft: number;
  href?: string;
  subtitle?: string;
}) {
  const body = (
    <div className={`rounded-xl border border-line bg-panel p-5 ${href ? "transition hover:border-wave/50" : ""}`}>
      <p className="text-[10px] font-black uppercase tracking-[.18em] text-wave">{label}</p>
      <p className="mt-2 text-3xl font-black">{published}</p>
      <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
      {draft > 0 ? <p className="mt-2 text-sm text-zinc-600">{draft} drafts</p> : null}
    </div>
  );

  if (href) {
    return <Link href={href}>{body}</Link>;
  }
  return body;
}
