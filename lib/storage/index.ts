import { localStorage } from "@/lib/storage/local";
import { s3Storage } from "@/lib/storage/s3";
import type { StorageAdapter } from "@/lib/storage/types";

export function getStorage(): StorageAdapter {
  return (process.env.STORAGE_DRIVER ?? "local") === "s3" ? s3Storage : localStorage;
}

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

export function validateUpload(file: { type: string; size: number }) {
  if (!ALLOWED_MIME.has(file.type)) return "Invalid file type";
  if (file.size > MAX_BYTES) return "File too large (max 5MB)";
  return null;
}
