"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/media/ImageUploader";

type ContentFormData = {
  title: string;
  tamilTitle: string;
  slug: string;
  description: string;
  year: number;
  type: string;
  genre: string;
  status: string;
  quality: string;
  accent: string;
  featured: boolean;
  trending: boolean;
  posterUrl: string;
  trailerUrl: string;
  rating: string;
  ratingCount: string;
  runtimeMinutes: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  ogImageUrl: string;
};

const empty: ContentFormData = {
  title: "",
  tamilTitle: "",
  slug: "",
  description: "",
  year: new Date().getFullYear(),
  type: "MOVIE",
  genre: "Drama",
  status: "DRAFT",
  quality: "HD",
  accent: "#00c853",
  featured: false,
  trending: false,
  posterUrl: "",
  trailerUrl: "",
  rating: "",
  ratingCount: "",
  runtimeMinutes: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  canonicalUrl: "",
  ogImageUrl: ""
};

export function ContentForm({
  initial,
  contentId,
  readOnly
}: {
  initial?: Partial<ContentFormData>;
  contentId?: string;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ContentFormData>({ ...empty, ...initial });
  const [tab, setTab] = useState<"details" | "media" | "seo">("details");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ContentFormData>(key: K, value: ContentFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (readOnly) return;
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      year: Number(form.year),
      rating: form.rating ? Number(form.rating) : null,
      ratingCount: form.ratingCount ? Number(form.ratingCount) : null,
      runtimeMinutes: form.runtimeMinutes ? Number(form.runtimeMinutes) : null,
      keywords: form.keywords ? form.keywords.split(",").map((k) => k.trim()).filter(Boolean) : []
    };
    const url = contentId ? `/api/admin/content/${contentId}` : "/api/admin/content";
    const method = contentId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Save failed");
      return;
    }
    router.push(`/admin/content/${data.id}`);
    router.refresh();
  }

  const tabs = [
    ["details", "Details"],
    ["media", "Media"],
    ["seo", "SEO"]
  ] as const;

  return (
    <form onSubmit={submit} className="max-w-3xl">
      <div className="mb-6 flex gap-2">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-lg px-4 py-2 text-xs font-bold ${tab === key ? "bg-wave text-black" : "bg-panel text-zinc-400"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "details" && (
        <div className="grid gap-4">
          <input
            className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
            placeholder="Title"
            value={form.title}
            disabled={readOnly}
            onChange={(e) => update("title", e.target.value)}
            required
          />
          <input
            className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
            placeholder="Tamil title"
            value={form.tamilTitle}
            disabled={readOnly}
            onChange={(e) => update("tamilTitle", e.target.value)}
          />
          <input
            className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
            placeholder="Slug"
            value={form.slug}
            disabled={readOnly || !!contentId}
            onChange={(e) => update("slug", e.target.value)}
            required
          />
          <textarea
            className="min-h-28 rounded-xl border border-line bg-panel px-4 py-3 text-sm"
            placeholder="Description"
            value={form.description}
            disabled={readOnly}
            onChange={(e) => update("description", e.target.value)}
            required
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              type="number"
              className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
              placeholder="Year"
              value={form.year}
              disabled={readOnly}
              onChange={(e) => update("year", Number(e.target.value))}
            />
            <select
              className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
              value={form.type}
              disabled={readOnly}
              onChange={(e) => update("type", e.target.value)}
            >
              <option value="MOVIE">Movie</option>
              <option value="WEB_SERIES">Web Series</option>
              <option value="DUBBED_MOVIE">Dubbed</option>
            </select>
            <select
              className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
              value={form.status}
              disabled={readOnly}
              onChange={(e) => update("status", e.target.value)}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <input
            className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
            placeholder="Primary genre"
            value={form.genre}
            disabled={readOnly}
            onChange={(e) => update("genre", e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
              placeholder="Trailer URL"
              value={form.trailerUrl}
              disabled={readOnly}
              onChange={(e) => update("trailerUrl", e.target.value)}
            />
            <input
              type="number"
              step="0.1"
              className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
              placeholder="Rating (0-10)"
              value={form.rating}
              disabled={readOnly}
              onChange={(e) => update("rating", e.target.value)}
            />
            <input
              type="number"
              className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
              placeholder="Runtime (minutes)"
              value={form.runtimeMinutes}
              disabled={readOnly}
              onChange={(e) => update("runtimeMinutes", e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              disabled={readOnly}
              onChange={(e) => update("featured", e.target.checked)}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.trending}
              disabled={readOnly}
              onChange={(e) => update("trending", e.target.checked)}
            />
            Trending flag
          </label>
        </div>
      )}

      {tab === "media" && (
        <div className="grid gap-6">
          <ImageUploader
            value={form.posterUrl}
            onChange={(url) => update("posterUrl", url ?? "")}
            disabled={readOnly}
          />
          <ImageUploader
            value={form.ogImageUrl}
            onChange={(url) => update("ogImageUrl", url ?? "")}
            label="Open Graph image"
            disabled={readOnly}
          />
        </div>
      )}

      {tab === "seo" && (
        <div className="grid gap-4">
          <input
            className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
            placeholder="Meta title"
            value={form.metaTitle}
            disabled={readOnly}
            onChange={(e) => update("metaTitle", e.target.value)}
          />
          <textarea
            className="min-h-24 rounded-xl border border-line bg-panel px-4 py-3 text-sm"
            placeholder="Meta description"
            value={form.metaDescription}
            disabled={readOnly}
            onChange={(e) => update("metaDescription", e.target.value)}
          />
          <input
            className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
            placeholder="Keywords (comma-separated)"
            value={form.keywords}
            disabled={readOnly}
            onChange={(e) => update("keywords", e.target.value)}
          />
          <input
            className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
            placeholder="Canonical URL"
            value={form.canonicalUrl}
            disabled={readOnly}
            onChange={(e) => update("canonicalUrl", e.target.value)}
          />
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      {!readOnly && (
        <button
          type="submit"
          disabled={saving}
          className="mt-6 rounded-xl bg-wave px-6 py-3 text-sm font-black text-black disabled:opacity-50"
        >
          {saving ? "Saving…" : contentId ? "Update content" : "Create content"}
        </button>
      )}
    </form>
  );
}
