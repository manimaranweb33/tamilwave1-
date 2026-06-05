"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/media/ImageUploader";
import {
  emptyContentForm,
  type ContentFormData,
  type PlatformOption
} from "@/lib/admin/content-form";
import { slugifyTitle } from "@/lib/validations/content";

const inputClass =
  "w-full rounded-xl border border-line bg-panel px-4 py-3 text-sm outline-none focus:border-wave";

export function ContentForm({
  initial,
  contentId,
  readOnly,
  platforms: platformOptions
}: {
  initial?: Partial<ContentFormData>;
  contentId?: string;
  readOnly?: boolean;
  platforms: PlatformOption[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<ContentFormData>({
    ...emptyContentForm(initial?.type ?? "MOVIE"),
    ...initial,
    platforms: initial?.platforms ?? []
  });
  const [tab, setTab] = useState<"details" | "type" | "media" | "platforms" | "seo">("details");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugHint, setSlugHint] = useState<string | null>(null);

  function update<K extends keyof ContentFormData>(key: K, value: ContentFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  useEffect(() => {
    if (contentId || !form.title || form.slug) return;
    const next = slugifyTitle(form.title);
    if (next) update("slug", next);
  }, [form.title, contentId, form.slug]);

  useEffect(() => {
    if (!form.slug || form.slug.length < 2) {
      setSlugHint(null);
      return;
    }
    const timer = setTimeout(async () => {
      const params = new URLSearchParams({ slug: form.slug });
      if (contentId) params.set("excludeId", contentId);
      const res = await fetch(`/api/admin/content/check-slug?${params}`);
      const data = await res.json();
      setSlugHint(data.available ? "Slug is available" : (data.message as string) ?? "Slug is taken");
    }, 400);
    return () => clearTimeout(timer);
  }, [form.slug, contentId]);

  function addPlatformRow() {
    if (!platformOptions.length) return;
    update("platforms", [
      ...form.platforms,
      { platformId: platformOptions[0].id, url: "https://" }
    ]);
  }

  function updatePlatform(index: number, field: "platformId" | "url", value: string) {
    const next = [...form.platforms];
    next[index] = { ...next[index], [field]: value };
    update("platforms", next);
  }

  function removePlatform(index: number) {
    update(
      "platforms",
      form.platforms.filter((_, i) => i !== index)
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (readOnly) return;
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!form.slug.trim()) {
      setError("Slug is required");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      year: Number(form.year),
      rating: form.rating ? Number(form.rating) : null,
      ratingCount: form.ratingCount ? Number(form.ratingCount) : null,
      runtimeMinutes: form.runtimeMinutes ? Number(form.runtimeMinutes) : null,
      seriesSeasons: form.seriesSeasons ? Number(form.seriesSeasons) : null,
      seriesEpisodes: form.seriesEpisodes ? Number(form.seriesEpisodes) : null,
      keywords: form.keywords
        ? form.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
        : [],
      platforms: form.platforms.filter((p) => p.platformId && p.url)
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
    ["type", "Type fields"],
    ["media", "Media"],
    ["platforms", "Platforms"],
    ["seo", "SEO"]
  ] as const;

  const isSeries = form.type === "WEB_SERIES";
  const isDubbed = form.type === "DUBBED_MOVIE";

  return (
    <form onSubmit={submit} className="max-w-3xl">
      <div className="mb-6 flex flex-wrap gap-2">
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
          <input className={inputClass} placeholder="Title *" value={form.title} disabled={readOnly} onChange={(e) => update("title", e.target.value)} required />
          <input className={inputClass} placeholder="Original / Tamil title" value={form.tamilTitle} disabled={readOnly} onChange={(e) => update("tamilTitle", e.target.value)} />
          <div>
            <input
              className={inputClass}
              placeholder="Slug *"
              value={form.slug}
              disabled={readOnly}
              onChange={(e) => update("slug", e.target.value)}
              required
            />
            {slugHint ? (
              <p className={`mt-1 text-xs ${slugHint === "Slug is available" ? "text-wave" : "text-zinc-500"}`}>
                {slugHint}
              </p>
            ) : null}
          </div>
          <textarea className={`${inputClass} min-h-28`} placeholder="Description *" value={form.description} disabled={readOnly} onChange={(e) => update("description", e.target.value)} required />
          <div className="grid gap-4 sm:grid-cols-3">
            <input type="number" className={inputClass} placeholder="Release year *" value={form.year} disabled={readOnly} onChange={(e) => update("year", Number(e.target.value))} />
            <select className={inputClass} value={form.type} disabled={readOnly || !!contentId} onChange={(e) => update("type", e.target.value)}>
              <option value="MOVIE">Movie</option>
              <option value="WEB_SERIES">Web Series</option>
              <option value="DUBBED_MOVIE">Dubbed</option>
            </select>
            <select className={inputClass} value={form.status} disabled={readOnly} onChange={(e) => update("status", e.target.value)}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className={inputClass} placeholder="Genre *" value={form.genre} disabled={readOnly} onChange={(e) => update("genre", e.target.value)} />
            <input className={inputClass} placeholder="Language" value={form.language} disabled={readOnly} onChange={(e) => update("language", e.target.value)} />
            <input className={inputClass} placeholder="Country" value={form.country} disabled={readOnly} onChange={(e) => update("country", e.target.value)} />
            <input className={inputClass} placeholder="Quality" value={form.quality} disabled={readOnly} onChange={(e) => update("quality", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className={inputClass} placeholder="Trailer URL" value={form.trailerUrl} disabled={readOnly} onChange={(e) => update("trailerUrl", e.target.value)} />
            <input type="number" step="0.1" className={inputClass} placeholder="Rating (0–10)" value={form.rating} disabled={readOnly} onChange={(e) => update("rating", e.target.value)} />
            <input type="number" className={inputClass} placeholder="Runtime (minutes)" value={form.runtimeMinutes} disabled={readOnly} onChange={(e) => update("runtimeMinutes", e.target.value)} />
            <input type="number" className={inputClass} placeholder="Rating count" value={form.ratingCount} disabled={readOnly} onChange={(e) => update("ratingCount", e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} disabled={readOnly} onChange={(e) => update("featured", e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.trending} disabled={readOnly} onChange={(e) => update("trending", e.target.checked)} />
            Trending flag
          </label>
        </div>
      )}

      {tab === "type" && (
        <div className="grid gap-4">
          {isSeries && (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-wave">Web series</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <input type="number" className={inputClass} placeholder="Seasons" value={form.seriesSeasons} disabled={readOnly} onChange={(e) => update("seriesSeasons", e.target.value)} />
                <input type="number" className={inputClass} placeholder="Episodes" value={form.seriesEpisodes} disabled={readOnly} onChange={(e) => update("seriesEpisodes", e.target.value)} />
                <select className={inputClass} value={form.seriesStatus} disabled={readOnly} onChange={(e) => update("seriesStatus", e.target.value)}>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
            </>
          )}
          {isDubbed && (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-wave">Dubbed content</p>
              <input className={inputClass} placeholder="Source title (original)" value={form.sourceTitle} disabled={readOnly} onChange={(e) => update("sourceTitle", e.target.value)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={inputClass} placeholder="Original language" value={form.originalLanguage} disabled={readOnly} onChange={(e) => update("originalLanguage", e.target.value)} />
                <input className={inputClass} placeholder="Dubbed language" value={form.dubbedLanguage} disabled={readOnly} onChange={(e) => update("dubbedLanguage", e.target.value)} />
              </div>
            </>
          )}
          {!isSeries && !isDubbed && (
            <p className="text-sm text-zinc-500">No extra fields for movies. Use Media for poster and backdrop.</p>
          )}
        </div>
      )}

      {tab === "media" && (
        <div className="grid gap-6">
          <ImageUploader value={form.posterUrl} onChange={(url) => update("posterUrl", url ?? "")} label="Poster" disabled={readOnly} />
          <ImageUploader value={form.backdropUrl} onChange={(url) => update("backdropUrl", url ?? "")} label="Backdrop image" disabled={readOnly} />
          <ImageUploader value={form.ogImageUrl} onChange={(url) => update("ogImageUrl", url ?? "")} label="Open Graph image" disabled={readOnly} />
        </div>
      )}

      {tab === "platforms" && (
        <div className="grid gap-4">
          <p className="text-xs text-zinc-500">Link this title to streaming platforms.</p>
          {form.platforms.map((row, index) => (
            <div key={`${row.platformId}-${index}`} className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-[1fr_1fr_auto]">
              <select
                className={inputClass}
                value={row.platformId}
                disabled={readOnly}
                onChange={(e) => updatePlatform(index, "platformId", e.target.value)}
              >
                {platformOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input className={inputClass} placeholder="Watch URL" value={row.url} disabled={readOnly} onChange={(e) => updatePlatform(index, "url", e.target.value)} />
              {!readOnly && (
                <button type="button" onClick={() => removePlatform(index)} className="rounded-lg border border-line px-3 text-xs font-bold text-red-400">
                  Remove
                </button>
              )}
            </div>
          ))}
          {!readOnly && (
            <button type="button" onClick={addPlatformRow} className="w-fit rounded-xl border border-line px-4 py-2 text-xs font-bold hover:border-wave">
              Add platform link
            </button>
          )}
        </div>
      )}

      {tab === "seo" && (
        <div className="grid gap-4">
          <input className={inputClass} placeholder="Meta title" value={form.metaTitle} disabled={readOnly} onChange={(e) => update("metaTitle", e.target.value)} />
          <textarea className={`${inputClass} min-h-24`} placeholder="Meta description" value={form.metaDescription} disabled={readOnly} onChange={(e) => update("metaDescription", e.target.value)} />
          <input className={inputClass} placeholder="Keywords (comma-separated)" value={form.keywords} disabled={readOnly} onChange={(e) => update("keywords", e.target.value)} />
          <input className={inputClass} placeholder="Canonical URL" value={form.canonicalUrl} disabled={readOnly} onChange={(e) => update("canonicalUrl", e.target.value)} />
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      {!readOnly && (
        <button type="submit" disabled={saving} className="mt-6 rounded-xl bg-wave px-6 py-3 text-sm font-black text-black disabled:opacity-50">
          {saving ? "Saving…" : contentId ? "Update content" : "Create content"}
        </button>
      )}
    </form>
  );
}
