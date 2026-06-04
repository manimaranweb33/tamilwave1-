import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireEditorSession } from "@/lib/admin/session";
import { getStorage, validateUpload } from "@/lib/storage";

export async function POST(request: Request) {
  const { user, error } = await requireEditorSession();
  if (error) return error;

  const form = await request.formData();
  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const validation = validateUpload({ type: file.type, size: file.size });
  if (validation) return NextResponse.json({ error: validation }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const storage = getStorage();
  const result = await storage.upload(buffer, file.name, file.type);

  const asset = await db.mediaAsset.create({
    data: {
      key: result.key,
      url: result.url,
      mimeType: file.type,
      sizeBytes: file.size,
      uploadedById: user!.id
    }
  });

  return NextResponse.json({ url: result.url, key: result.key, id: asset.id }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { error } = await requireEditorSession();
  if (error) return error;

  const { key } = await request.json();
  if (!key) return NextResponse.json({ error: "Key required" }, { status: 400 });

  const storage = getStorage();
  await storage.delete(key);
  await db.mediaAsset.deleteMany({ where: { key } });
  return new NextResponse(null, { status: 204 });
}
