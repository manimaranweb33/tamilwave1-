import Link from "next/link";

export function Pagination({
  page,
  pages,
  basePath,
  searchParams
}: {
  page: number;
  pages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (pages <= 1) return null;

  const makeHref = (targetPage: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") params.set(key, value);
    });
    if (targetPage > 1) params.set("page", String(targetPage));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={makeHref(page - 1)}
        className={`rounded-lg border border-line px-3 py-2 text-xs font-bold ${page <= 1 ? "pointer-events-none opacity-40" : "hover:border-wave"}`}
        aria-disabled={page <= 1}
      >
        Previous
      </Link>
      <span className="px-2 text-xs text-zinc-500">
        Page {page} of {pages}
      </span>
      <Link
        href={makeHref(page + 1)}
        className={`rounded-lg border border-line px-3 py-2 text-xs font-bold ${page >= pages ? "pointer-events-none opacity-40" : "hover:border-wave"}`}
        aria-disabled={page >= pages}
      >
        Next
      </Link>
    </nav>
  );
}
