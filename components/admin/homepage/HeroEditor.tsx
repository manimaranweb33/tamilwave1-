"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/media/ImageUploader";

type Hero = {
  id: string;
  title: string;
  subtitle: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  backgroundImageUrl: string | null;
  active: boolean;
};

export function HeroEditor({ heroes: initial }: { heroes: Hero[] }) {
  const router = useRouter();
  const active = initial[0];
  const [form, setForm] = useState({
    title: active?.title ?? "Your next Tamil favorite starts here.",
    subtitle: active?.subtitle ?? "",
    ctaLabel: active?.ctaLabel ?? "Explore Releases",
    ctaHref: active?.ctaHref ?? "#recently-added",
    backgroundImageUrl: active?.backgroundImageUrl ?? ""
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const method = active ? "PATCH" : "POST";
    const body = active ? { id: active.id, ...form, active: true } : { ...form, active: true };
    await fetch("/api/admin/homepage/hero", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="max-w-xl grid gap-4">
      <input
        className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        placeholder="Hero title"
      />
      <input
        className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
        value={form.subtitle}
        onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
        placeholder="Subtitle"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
          value={form.ctaLabel}
          onChange={(e) => setForm((f) => ({ ...f, ctaLabel: e.target.value }))}
          placeholder="CTA label"
        />
        <input
          className="rounded-xl border border-line bg-panel px-4 py-3 text-sm"
          value={form.ctaHref}
          onChange={(e) => setForm((f) => ({ ...f, ctaHref: e.target.value }))}
          placeholder="CTA href"
        />
      </div>
      <ImageUploader
        value={form.backgroundImageUrl}
        onChange={(url) => setForm((f) => ({ ...f, backgroundImageUrl: url ?? "" }))}
        label="Background image"
      />
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="w-fit rounded-xl bg-wave px-5 py-3 text-sm font-black text-black"
      >
        {saving ? "Saving…" : "Save hero"}
      </button>
    </div>
  );
}
