import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { requireCMSAccess } from "@/lib/admin/session";
import { updateContent, softDeleteContent } from "@/lib/admin/content-service";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireCMSAccess();
  const bearer = requireAdmin(request);
  if (session.error && bearer) return bearer;
  if (session.error) return session.error;

  try {
    const body = await request.json();
    const item = await updateContent(params.id, body);
    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await requireCMSAccess();
  const bearer = requireAdmin(request);
  if (session.error && bearer) return bearer;
  if (session.error) return session.error;

  await softDeleteContent(params.id);
  return new NextResponse(null, { status: 204 });
}
