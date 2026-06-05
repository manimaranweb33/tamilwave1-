import { NextResponse } from "next/server";
import { requireEditorSession } from "@/lib/admin/session";
import { bulkPermanentDelete, permanentDeleteContent } from "@/lib/admin/content-service";
import { bulkDeleteSchema } from "@/lib/validations/content";
import { logAudit } from "@/lib/admin/audit";

export async function POST(request: Request) {
  const { user, error } = await requireEditorSession();
  if (error) return error;

  try {
    const body = await request.json();
    const { ids } = bulkDeleteSchema.parse(body);

    if (ids.length === 1) {
      await permanentDeleteContent(ids[0]);
      await logAudit({
        actorId: user!.id,
        action: "DELETE",
        entity: "Content",
        entityId: ids[0],
        metadata: { permanent: true }
      });
      return NextResponse.json({ deleted: 1 });
    }

    const result = await bulkPermanentDelete(ids);
    await logAudit({
      actorId: user!.id,
      action: "BULK_DELETE",
      entity: "Content",
      metadata: { ids, count: result.count, permanent: true }
    });
    return NextResponse.json({ deleted: result.count });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
