"use client";

import { X } from "lucide-react";
import { youtubeEmbedUrl } from "@/lib/youtube";

export function TrailerModal({
  open,
  title,
  trailerUrl,
  onClose
}: {
  open: boolean;
  title: string;
  trailerUrl: string;
  onClose: () => void;
}) {
  if (!open) return null;
  const embed = youtubeEmbedUrl(trailerUrl);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/80" aria-label="Close" onClick={onClose} />
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h3 className="font-black">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-zinc-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="aspect-video bg-black">
          {embed ? (
            <iframe
              title={`${title} trailer`}
              src={embed}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-zinc-500">Trailer unavailable</div>
          )}
        </div>
      </div>
    </div>
  );
}
