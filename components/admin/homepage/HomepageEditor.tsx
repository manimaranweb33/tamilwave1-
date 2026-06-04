"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Slot = { contentId: string; position: number; content?: { title: string; slug: string } };
type Section = { id: string; key: string; title: string; slots: Slot[] };

export function HomepageEditor({ sections: initial }: { sections: Section[] }) {
  const router = useRouter();
  const [sections, setSections] = useState(initial);
  const [contentId, setContentId] = useState("");
  const [saving, setSaving] = useState(false);

  async function addSlot(sectionKey: string) {
    if (!contentId.trim()) return;
    setSaving(true);
    const section = sections.find((s) => s.key === sectionKey);
    const slots = [
      ...(section?.slots ?? []).map((s, i) => ({
        contentId: s.contentId,
        position: i,
        active: true
      })),
      { contentId: contentId.trim(), position: section?.slots.length ?? 0, active: true }
    ];
    await fetch("/api/admin/homepage", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionKey, slots })
    });
    setSaving(false);
    setContentId("");
    router.refresh();
  }

  return (
    <div className="grid gap-8">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border border-line bg-panel px-4 py-2 text-sm"
          placeholder="Content ID to add to slot"
          value={contentId}
          onChange={(e) => setContentId(e.target.value)}
        />
      </div>
      {sections
        .filter((s) => s.key !== "HERO")
        .map((section) => (
          <div key={section.id} className="rounded-xl border border-line p-4">
            <h2 className="font-black">{section.title}</h2>
            <p className="text-xs text-zinc-500">{section.key}</p>
            <ul className="mt-3 space-y-2">
              {section.slots.map((slot) => (
                <li key={slot.contentId} className="text-sm text-zinc-400">
                  #{slot.position} — {slot.content?.title ?? slot.contentId}
                </li>
              ))}
              {!section.slots.length && <li className="text-xs text-zinc-600">No slots</li>}
            </ul>
            <button
              type="button"
              disabled={saving}
              onClick={() => addSlot(section.key)}
              className="mt-3 rounded-lg border border-line px-3 py-1.5 text-xs font-bold hover:border-wave"
            >
              Add slot
            </button>
          </div>
        ))}
    </div>
  );
}
