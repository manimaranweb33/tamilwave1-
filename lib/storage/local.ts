import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import type { StorageAdapter, UploadResult } from "@/lib/storage/types";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export const localStorage: StorageAdapter = {
  async upload(file: Buffer, filename: string): Promise<UploadResult> {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const key = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(UPLOAD_DIR, key);
    await writeFile(filePath, file);
    return { key, url: `/uploads/${key}` };
  },
  async delete(key: string) {
    const filePath = path.join(UPLOAD_DIR, key);
    try {
      await unlink(filePath);
    } catch {
      // ignore
    }
  }
};
