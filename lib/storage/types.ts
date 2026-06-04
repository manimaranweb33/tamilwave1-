export type UploadResult = { url: string; key: string };

export interface StorageAdapter {
  upload(file: Buffer, filename: string, mimeType: string): Promise<UploadResult>;
  delete(key: string): Promise<void>;
}
