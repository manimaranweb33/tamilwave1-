"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminToast } from "@/components/admin/ui/AdminToast";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";

type MediaItem = {
  id: string;
  key: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
  uploadedBy?: { email: string | null; name: string | null } | null;
};

export function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [confirmKey, setConfirmKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const load = useCallback(async (targetPage: number) => {
    setLoading(true);
    const res = await fetch(`/api/admin/media?page=${targetPage}&pageSize=24`);
    const data = await res.json();
    setItems(data.items ?? []);
    setPage(data.page ?? 1);
    setPages(data.pages ?? 1);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  async function remove(key: string) {
    setDeletingKey(key);
    try {
      const res = await fetch("/api/admin/uploads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key })
      });
      if (!res.ok) throw new Error("Delete failed");
      setItems((rows) => rows.filter((row) => row.key !== key));
      setToast({ message: "Media file deleted.", type: "success" });
    } catch {
      setToast({ message: "Failed to delete media file.", type: "error" });
    } finally {
      setDeletingKey(null);
      setConfirmKey(null);
    }
  }

  return (
    <div>
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {items.map((item) => (
            <figure key={item.id} className="group overflow-hidden rounded-xl border border-line bg-panel">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className="aspect-[2/3] w-full object-cover" loading="lazy" />
              <figcaption className="p-2 text-[10px] text-zinc-500">
                <p className="truncate font-bold text-zinc-400">{item.key}</p>
                <p>{(item.sizeBytes / 1024).toFixed(0)} KB</p>
                <button
                  type="button"
                  disabled={deletingKey === item.key}
                  onClick={() => setConfirmKey(item.key)}
                  className="mt-2 w-full rounded-lg border border-red-900/50 py-1 text-[10px] font-bold text-red-400 opacity-0 transition group-hover:opacity-100 disabled:opacity-50"
                >
                  Delete
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => load(page - 1)}
            className="rounded-lg border border-line px-3 py-2 text-xs font-bold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-2 py-2 text-xs text-zinc-500">
            {page} / {pages}
          </span>
          <button
            type="button"
            disabled={page >= pages || loading}
            onClick={() => load(page + 1)}
            className="rounded-lg border border-line px-3 py-2 text-xs font-bold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      <ConfirmModal
        open={!!confirmKey}
        title="Delete media file?"
        message="This permanently removes the file from storage. Content using this URL may show broken images."
        confirmLabel="Delete file"
        destructive
        loading={!!deletingKey}
        onConfirm={() => confirmKey && remove(confirmKey)}
        onCancel={() => setConfirmKey(null)}
      />

      {toast ? <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
