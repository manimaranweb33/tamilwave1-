import { NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { requireCMSAccess } from "@/lib/admin/session";
import { bulkUpdateStatus } from "@/lib/admin/content-service";
import { bulkStatusSchema } from "@/lib/validations/content";
import { logAudit } from "@/lib/admin/audit";

export async function POST(request: Request) {
  const { user, error } = await requireCMSAccess();
  if (error) return error;

  try {
    const { ids, status } = bulkStatusSchema.parse(await request.json());
    const result = await bulkUpdateStatus(ids, status as ContentStatus);
    await logAudit({
      actorId: user!.id,
      action: status === "PUBLISHED" ? "PUBLISH" : "UNPUBLISH",
      entity: "Content",
      metadata: { ids, status, count: result.count }
    });
    return NextResponse.json({ updated: result.count });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
