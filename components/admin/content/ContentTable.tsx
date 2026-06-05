"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { AdminToast } from "@/components/admin/ui/AdminToast";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";

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
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirm, setConfirm] = useState<"archive" | "delete" | null>(null);

  const notify = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function bulkStatus(action: "publish" | "draft" | "archive") {
    if (!selected.size) return;
    setLoading(true);
    const ids = Array.from(selected);
    try {
      if (action === "archive") {
        const res = await fetch("/api/admin/content/bulk-delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids })
        });
        if (!res.ok) throw new Error("Archive failed");
        notify(`${ids.length} item(s) archived.`);
      } else {
        const res = await fetch("/api/admin/content/bulk-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ids,
            status: action === "publish" ? "PUBLISHED" : "DRAFT"
          })
        });
        if (!res.ok) throw new Error("Update failed");
        notify(action === "publish" ? "Selected items published." : "Selected items unpublished.");
      }
      setSelected(new Set());
      router.refresh();
    } catch {
      notify("Bulk action failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function bulkDeletePermanent() {
    if (!selected.size) return;
    setLoading(true);
    const ids = Array.from(selected);
    try {
      const res = await fetch("/api/admin/content/permanent-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids })
      });
      if (!res.ok) throw new Error("Delete failed");
      const data = await res.json();
      notify(`${data.deleted ?? ids.length} item(s) permanently deleted.`);
      setSelected(new Set());
      router.refresh();
    } catch {
      notify("Permanent delete failed. Please try again.", "error");
    } finally {
      setLoading(false);
      setConfirm(null);
    }
  }

  return (
    <div>
      {canEdit && selected.size > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => bulkStatus("publish")}
            className="rounded-lg bg-wave px-3 py-1.5 text-xs font-black text-black disabled:opacity-50"
          >
            Publish selected
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => bulkStatus("draft")}
            className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold disabled:opacity-50"
          >
            Unpublish
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => bulkStatus("archive")}
            className="rounded-lg border border-amber-800 px-3 py-1.5 text-xs font-bold text-amber-400 disabled:opacity-50"
          >
            Archive selected
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => setConfirm("delete")}
            className="rounded-lg border border-red-800 px-3 py-1.5 text-xs font-bold text-red-400 disabled:opacity-50"
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

      <ConfirmModal
        open={confirm === "delete"}
        title={`Delete ${selected.size} item(s) permanently?`}
        message="This cannot be undone. Selected items will be permanently removed from the database."
        confirmLabel="Delete permanently"
        destructive
        loading={loading}
        onConfirm={bulkDeletePermanent}
        onCancel={() => setConfirm(null)}
      />

      {toast ? <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
