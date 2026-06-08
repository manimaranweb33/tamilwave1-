import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCMSAccess } from "@/lib/admin/session";
import { archiveContent, contentInclude, updateContent } from "@/lib/admin/content-service";
import { contentToAdminJson } from "@/lib/admin/content-mapper";
import { logAudit } from "@/lib/admin/audit";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { error } = await requireCMSAccess();
  if (error) return error;

  const item = await db.content.findFirst({
    where: { id: params.id, deletedAt: null },
    include: contentInclude
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(contentToAdminJson(item));
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { user, error } = await requireCMSAccess();
  if (error) return error;

  try {
    const body = await request.json();
    const item = await updateContent(params.id, body);
    await logAudit({
      actorId: user!.id,
      action: "UPDATE",
      entity: "Content",
      entityId: params.id
    });
    return NextResponse.json(contentToAdminJson(item!));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    const status = message === "Not found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { user, error } = await requireCMSAccess();
  if (error) return error;

  await archiveContent(params.id);
  await logAudit({
    actorId: user!.id,
    action: "DELETE",
    entity: "Content",
    entityId: params.id,
    metadata: { archived: true }
  });
  return new NextResponse(null, { status: 204 });
}
