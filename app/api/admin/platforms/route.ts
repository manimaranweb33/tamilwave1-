import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCMSAccess } from "@/lib/admin/session";
import { ensureDefaultPlatforms } from "@/lib/admin/ensure-platforms";
import { platformSchema } from "@/lib/validations/platform";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { error } = await requireCMSAccess();
  if (error) return error;

  await ensureDefaultPlatforms();
  const platforms = await db.platform.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { contents: true } } }
  });
  return NextResponse.json({ platforms });
}

export async function POST(request: Request) {
  const { error } = await requireCMSAccess();
  if (error) return error;

  try {
    const data = platformSchema.parse(await request.json());
    const platform = await db.platform.create({
      data: {
        name: data.name,
        slug: data.slug,
        logoUrl: data.logoUrl || null
      }
    });
    revalidatePath("/");
    return NextResponse.json({ platform }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid platform data" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const { error } = await requireCMSAccess();
  if (error) return error;

  const body = await request.json();
  const { id, ...rest } = body;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    const data = platformSchema.partial().parse(rest);
    const platform = await db.platform.update({
      where: { id },
      data: {
        ...data,
        logoUrl: data.logoUrl === "" ? null : data.logoUrl
      }
    });
    revalidatePath("/");
    return NextResponse.json({ platform });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireCMSAccess();
  if (error) return error;

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const linked = await db.contentPlatform.count({ where: { platformId: id } });
  if (linked > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${linked} title(s) still linked to this platform.` },
      { status: 409 }
    );
  }

  await db.platform.delete({ where: { id } });
  revalidatePath("/");
  return new NextResponse(null, { status: 204 });
}
