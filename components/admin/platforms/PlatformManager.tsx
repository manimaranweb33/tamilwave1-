"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/media/ImageUploader";
import { AdminToast } from "@/components/admin/ui/AdminToast";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";

type PlatformRow = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  _count?: { contents: number };
};

export function PlatformManager({ platforms: initial }: { platforms: PlatformRow[] }) {
  const router = useRouter();
  const [platforms, setPlatforms] = useState(initial);
  const [form, setForm] = useState({ name: "", slug: "", logoUrl: "" });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function saveNew() {
    if (!form.name.trim() || !form.slug.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/platforms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setSaving(false);
    if (res.ok) {
      setForm({ name: "", slug: "", logoUrl: "" });
      setToast({ message: "Platform added.", type: "success" });
      router.refresh();
    } else {
      setToast({ message: "Failed to add platform.", type: "error" });
    }
  }

  async function updatePlatform(platform: PlatformRow, patch: Partial<PlatformRow>) {
    setSaving(true);
    const res = await fetch("/api/admin/platforms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: platform.id, ...patch })
    });
    setSaving(false);
    if (res.ok) {
      setPlatforms((rows) => rows.map((row) => (row.id === platform.id ? { ...row, ...patch } : row)));
      router.refresh();
    } else {
      setToast({ message: "Update failed.", type: "error" });
    }
  }

  async function removePlatform(id: string) {
    setSaving(true);
    const res = await fetch("/api/admin/platforms", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    setSaving(false);
    setDeleteId(null);
    if (res.ok) {
      setPlatforms((rows) => rows.filter((row) => row.id !== id));
      setToast({ message: "Platform deleted.", type: "success" });
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setToast({
        message: data.error ?? "Failed to delete platform.",
        type: "error"
      });
    }
  }

  const deletingPlatform = platforms.find((p) => p.id === deleteId);

  return (
    <div className="grid gap-8">
      <div className="rounded-xl border border-line p-4">
        <h2 className="font-black">Add platform</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-xl border border-line bg-panel px-4 py-2 text-sm"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                name: e.target.value,
                slug: f.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")
              }))
            }
          />
          <input
            className="rounded-xl border border-line bg-panel px-4 py-2 text-sm"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
        </div>
        <div className="mt-4 max-w-xs">
          <ImageUploader value={form.logoUrl} onChange={(url) => setForm((f) => ({ ...f, logoUrl: url ?? "" }))} label="Logo" />
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={saveNew}
          className="mt-4 rounded-xl bg-wave px-4 py-2 text-sm font-black text-black disabled:opacity-50"
        >
          Add platform
        </button>
      </div>

      <div className="grid gap-3">
        {platforms.map((platform) => (
          <div key={platform.id} className="rounded-xl border border-line p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-black">{platform.name}</p>
                <p className="text-xs text-zinc-500">{platform.slug}</p>
                <p className="mt-1 text-[11px] text-zinc-600">
                  {platform._count?.contents ?? 0} linked titles
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="max-w-[120px]">
                  <ImageUploader
                    value={platform.logoUrl}
                    onChange={(url) => updatePlatform(platform, { logoUrl: url })}
                    label="Logo"
                  />
                </div>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setDeleteId(platform.id)}
                  className="rounded-lg border border-red-900/50 px-3 py-2 text-xs font-bold text-red-400 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <input
                className="rounded-lg border border-line bg-panel px-3 py-2 text-sm"
                defaultValue={platform.name}
                onBlur={(e) => {
                  if (e.target.value !== platform.name) updatePlatform(platform, { name: e.target.value });
                }}
              />
              <input
                className="rounded-lg border border-line bg-panel px-3 py-2 text-sm"
                defaultValue={platform.slug}
                onBlur={(e) => {
                  if (e.target.value !== platform.slug) updatePlatform(platform, { slug: e.target.value });
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!deleteId}
        title={`Delete ${deletingPlatform?.name ?? "platform"}?`}
        message={
          (deletingPlatform?._count?.contents ?? 0) > 0
            ? "This platform has linked titles and cannot be deleted until those links are removed."
            : "This permanently removes the platform from TamilWave."
        }
        confirmLabel="Delete platform"
        destructive
        loading={saving}
        onConfirm={() => deleteId && removePlatform(deleteId)}
        onCancel={() => setDeleteId(null)}
      />

      {toast ? <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
