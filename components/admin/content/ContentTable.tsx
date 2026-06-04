"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Row = {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  year: number;
};

export function ContentTable({
  items,
  canEdit
}: {
  items: Row[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function bulk(action: "delete" | "publish" | "draft") {
    if (!selected.size) return;
    setLoading(true);
    const ids = Array.from(selected);
    const url =
      action === "delete" ? "/api/admin/content/bulk-delete" : "/api/admin/content/bulk-status";
    const body =
      action === "delete"
        ? { ids }
        : { ids, status: action === "publish" ? "PUBLISHED" : "DRAFT" };
    await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setLoading(false);
    setSelected(new Set());
    router.refresh();
  }

  return (
    <div>
      {canEdit && selected.size > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => bulk("publish")}
            className="rounded-lg bg-wave px-3 py-1.5 text-xs font-black text-black"
          >
            Publish selected
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => bulk("draft")}
            className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold"
          >
            Unpublish
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => bulk("delete")}
            className="rounded-lg border border-red-800 px-3 py-1.5 text-xs font-bold text-red-400"
          >
            Delete selected
          </button>
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-zinc-900/50 text-xs uppercase text-zinc-500">
            <tr>
              {canEdit && <th className="p-3 w-8" />}
              <th className="p-3">Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Year</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-line/50 hover:bg-white/5">
                {canEdit && (
                  <td className="p-3">
                    <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggle(item.id)} />
                  </td>
                )}
                <td className="p-3">
                  <Link href={`/admin/content/${item.id}`} className="font-bold hover:text-wave">
                    {item.title}
                  </Link>
                  <p className="text-[10px] text-zinc-600">{item.slug}</p>
                </td>
                <td className="p-3 text-zinc-400">{item.type.replace("_", " ")}</td>
                <td className="p-3 text-zinc-400">{item.year}</td>
                <td className="p-3">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-black uppercase ${
                      item.status === "PUBLISHED" ? "bg-wave/20 text-wave" : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
