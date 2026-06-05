"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { AdminToast } from "@/components/admin/ui/AdminToast";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";

export function ContentActions({
  contentId,
  status,
  canEdit
}: {
  contentId: string;
  status: string;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirm, setConfirm] = useState<"archive" | "delete" | null>(null);

  const notify = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  }, []);

  if (!canEdit) return null;

  async function patchStatus(next: "PUBLISHED" | "DRAFT" | "ARCHIVED") {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content/${contentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next })
      });
      if (!res.ok) throw new Error("Update failed");
      notify(next === "PUBLISHED" ? "Published successfully." : next === "DRAFT" ? "Unpublished." : "Archived.");
      router.refresh();
    } catch {
      notify("Action failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function archive() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content/${contentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Archive failed");
      notify("Item archived and removed from the public site.");
      router.push("/admin/content");
      router.refresh();
    } catch {
      notify("Archive failed. Please try again.", "error");
    } finally {
      setLoading(false);
      setConfirm(null);
    }
  }

  async function deletePermanent() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content/permanent-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [contentId] })
      });
      if (!res.ok) throw new Error("Delete failed");
      notify("Item permanently deleted.");
      router.push("/admin/content");
      router.refresh();
    } catch {
      notify("Permanent delete failed. Please try again.", "error");
    } finally {
      setLoading(false);
      setConfirm(null);
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {status !== "PUBLISHED" ? (
          <button
            type="button"
            disabled={loading}
            onClick={() => patchStatus("PUBLISHED")}
            className="rounded-xl bg-wave px-4 py-2 text-xs font-black text-black disabled:opacity-50"
          >
            Publish
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={() => patchStatus("DRAFT")}
            className="rounded-xl border border-line px-4 py-2 text-xs font-bold disabled:opacity-50"
          >
            Unpublish
          </button>
        )}
        {status !== "ARCHIVED" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => setConfirm("archive")}
            className="rounded-xl border border-amber-900/60 px-4 py-2 text-xs font-bold text-amber-400 disabled:opacity-50"
          >
            Archive
          </button>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={() => setConfirm("delete")}
          className="rounded-xl border border-red-900/60 px-4 py-2 text-xs font-bold text-red-400 disabled:opacity-50"
        >
          Delete
        </button>
      </div>

      <ConfirmModal
        open={confirm === "archive"}
        title="Archive this item?"
        message="This removes the item from the public site and marks it as archived. You can restore it from the database if needed."
        confirmLabel="Archive"
        destructive={false}
        loading={loading}
        onConfirm={archive}
        onCancel={() => setConfirm(null)}
      />

      <ConfirmModal
        open={confirm === "delete"}
        title="Permanently delete this item?"
        message="This action cannot be undone. The item and all related links will be permanently removed from the database."
        confirmLabel="Delete permanently"
        destructive
        loading={loading}
        onConfirm={deletePermanent}
        onCancel={() => setConfirm(null)}
      />

      {toast ? <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
    </>
  );
}
