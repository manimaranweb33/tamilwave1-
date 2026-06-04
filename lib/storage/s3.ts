import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { StorageAdapter, UploadResult } from "@/lib/storage/types";

function getClient() {
  return new S3Client({
    region: process.env.S3_REGION ?? "auto",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? ""
    }
  });
}

export const s3Storage: StorageAdapter = {
  async upload(file: Buffer, filename: string, mimeType: string): Promise<UploadResult> {
    const bucket = process.env.S3_BUCKET!;
    const key = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const client = getClient();
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
        ContentType: mimeType
      })
    );
    const base = process.env.S3_PUBLIC_URL ?? `https://${bucket}.s3.amazonaws.com`;
    return { key, url: `${base}/${key}` };
  },
  async delete(key: string) {
    const client = getClient();
    await client.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key }));
  }
};
