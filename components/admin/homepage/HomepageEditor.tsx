"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HomepageSectionKey } from "@prisma/client";
import {
  CURATED_SECTION_KEYS,
  HOMEPAGE_SECTION_LIMITS,
  SECTION_ADMIN_LABELS
} from "@/lib/homepage-config";

type Slot = {
  contentId: string;
  position: number;
  content?: { title: string; slug: string; status?: string };
};

type Section = {
  id: string;
  key: HomepageSectionKey;
  title: string;
  slots: Slot[];
};

type SearchResult = {
  id: string;
  title: string;
  slug: string;
  status: string;
  year: number;
};

export function HomepageEditor({ sections: initial }: { sections: Section[] }) {
  const router = useRouter();
  const [sections, setSections] = useState(initial);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeSection, setActiveSection] = useState<HomepageSectionKey>(CURATED_SECTION_KEYS[0]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const curatedSections = useMemo(
    () => sections.filter((s) => CURATED_SECTION_KEYS.includes(s.key)),
    [sections]
  );

  const active = curatedSections.find((s) => s.key === activeSection);
  const maxSlots = HOMEPAGE_SECTION_LIMITS[activeSection] ?? 20;

  async function searchContent(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    const params = new URLSearchParams({
      q: value.trim(),
      status: "PUBLISHED",
      pageSize: "8"
    });
    const response = await fetch(`/api/admin/content?${params}`);
    const data = await response.json();
    setResults((data.items ?? []) as SearchResult[]);
  }

  async function persistSlots(sectionKey: HomepageSectionKey, slots: Slot[]) {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/homepage", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionKey,
        slots: slots.map((slot, index) => ({
          contentId: slot.contentId,
          position: index,
          active: true
        }))
      })
    });
    setSaving(false);
    if (!response.ok) {
      setMessage("Could not save section. Try again.");
      return;
    }
    setMessage("Section saved.");
    router.refresh();
  }

  function updateLocalSlots(sectionKey: HomepageSectionKey, slots: Slot[]) {
    setSections((prev) =>
      prev.map((section) => (section.key === sectionKey ? { ...section, slots } : section))
    );
  }

  async function addContent(item: SearchResult) {
    if (!active) return;
    if (active.slots.some((slot) => slot.contentId === item.id)) {
      setMessage("This title is already in the section.");
      return;
    }
    if (active.slots.length >= maxSlots) {
      setMessage(`Maximum ${maxSlots} items for this section.`);
      return;
    }
    const nextSlots = [
      ...active.slots,
      {
        contentId: item.id,
        position: active.slots.length,
        content: { title: item.title, slug: item.slug, status: item.status }
      }
    ];
    updateLocalSlots(activeSection, nextSlots);
    setQuery("");
    setResults([]);
    await persistSlots(activeSection, nextSlots);
  }

  async function removeSlot(contentId: string) {
    if (!active) return;
    const nextSlots = active.slots
      .filter((slot) => slot.contentId !== contentId)
      .map((slot, index) => ({ ...slot, position: index }));
    updateLocalSlots(activeSection, nextSlots);
    await persistSlots(activeSection, nextSlots);
  }

  async function moveSlot(contentId: string, direction: -1 | 1) {
    if (!active) return;
    const index = active.slots.findIndex((slot) => slot.contentId === contentId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= active.slots.length) return;
    const nextSlots = [...active.slots];
    [nextSlots[index], nextSlots[target]] = [nextSlots[target], nextSlots[index]];
    const reordered = nextSlots.map((slot, i) => ({ ...slot, position: i }));
    updateLocalSlots(activeSection, reordered);
    await persistSlots(activeSection, reordered);
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-2">
        {curatedSections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => {
              setActiveSection(section.key);
              setMessage("");
              setQuery("");
              setResults([]);
            }}
            className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
              activeSection === section.key
                ? "border-wave bg-wave/10 text-wave"
                : "border-line text-zinc-400 hover:border-wave/50"
            }`}
          >
            {SECTION_ADMIN_LABELS[section.key]}
            <span className="ml-1 text-zinc-600">
              ({section.slots.length}/{HOMEPAGE_SECTION_LIMITS[section.key] ?? "—"})
            </span>
          </button>
        ))}
      </div>

      {active ? (
        <div className="rounded-xl border border-line p-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="font-black">{SECTION_ADMIN_LABELS[active.key]}</h3>
              <p className="text-xs text-zinc-500">
                Curated slots appear on the public homepage. Max {maxSlots} published titles.
              </p>
            </div>
            <p className="text-xs text-zinc-500">{active.slots.length} / {maxSlots} slots</p>
          </div>

          <div className="relative mt-4">
            <input
              className="w-full rounded-xl border border-line bg-panel px-4 py-2.5 text-sm outline-none focus:border-wave"
              placeholder="Search published content to add…"
              value={query}
              onChange={(e) => searchContent(e.target.value)}
            />
            {results.length > 0 ? (
              <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-line bg-panel shadow-card">
                {results.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm hover:bg-wave/10"
                      onClick={() => addContent(item)}
                      disabled={saving}
                    >
                      <span>
                        <span className="font-bold">{item.title}</span>
                        <span className="mt-0.5 block text-[11px] text-zinc-500">
                          {item.slug} · {item.year}
                        </span>
                      </span>
                      <span className="text-[10px] font-bold uppercase text-wave">Add</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <ul className="mt-4 space-y-2">
            {active.slots.map((slot, index) => (
              <li
                key={slot.contentId}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-zinc-900/40 px-3 py-2.5 text-sm"
              >
                <span className="w-6 font-black text-wave">{index + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="font-bold">{slot.content?.title ?? slot.contentId}</span>
                  {slot.content?.slug ? (
                    <span className="mt-0.5 block truncate text-[11px] text-zinc-500">{slot.content.slug}</span>
                  ) : null}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={saving || index === 0}
                    onClick={() => moveSlot(slot.contentId, -1)}
                    className="rounded-lg border border-line px-2 py-1 text-[10px] font-bold disabled:opacity-40"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    disabled={saving || index === active.slots.length - 1}
                    onClick={() => moveSlot(slot.contentId, 1)}
                    className="rounded-lg border border-line px-2 py-1 text-[10px] font-bold disabled:opacity-40"
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => removeSlot(slot.contentId)}
                    className="rounded-lg border border-red-900/50 px-2 py-1 text-[10px] font-bold text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
            {!active.slots.length ? (
              <li className="rounded-lg border border-dashed border-line px-3 py-6 text-center text-xs text-zinc-600">
                No curated items — the homepage uses catalog fallback for this section.
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      {message ? <p className="text-xs font-bold text-wave">{message}</p> : null}
      {saving ? <p className="text-xs text-zinc-500">Saving…</p> : null}
    </div>
  );
}
