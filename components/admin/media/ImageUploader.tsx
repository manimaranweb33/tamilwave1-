"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";

export function ImageUploader({
  value,
  onChange,
  label = "Poster image",
  disabled
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  disabled?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/admin/uploads", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <p className="mb-2 text-xs font-bold text-zinc-400">{label}</p>
      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="" className="h-40 w-28 rounded-lg object-cover" />
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ) : (
        <label
          className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-line bg-zinc-900/50 ${disabled ? "opacity-50" : "hover:border-wave"}`}
        >
          <Upload className="h-5 w-5 text-zinc-500" />
          <span className="mt-2 text-xs text-zinc-500">{uploading ? "Uploading…" : "Upload image"}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={disabled || uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </label>
      )}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
