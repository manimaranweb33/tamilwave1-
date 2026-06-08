import { NextResponse } from "next/server";
import { requireCMSAccess } from "@/lib/admin/session";
import { bulkArchive } from "@/lib/admin/content-service";
import { bulkDeleteSchema } from "@/lib/validations/content";
import { logAudit } from "@/lib/admin/audit";

export async function POST(request: Request) {
  const { user, error } = await requireCMSAccess();
  if (error) return error;

  try {
    const { ids } = bulkDeleteSchema.parse(await request.json());
    const result = await bulkArchive(ids);
    await logAudit({
      actorId: user!.id,
      action: "BULK_DELETE",
      entity: "Content",
      metadata: { ids, count: result.count }
    });
    return NextResponse.json({ deleted: result.count });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
