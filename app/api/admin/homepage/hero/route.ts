import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCMSAccess } from "@/lib/admin/session";
import { heroSchema } from "@/lib/validations/homepage";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { error } = await requireCMSAccess();
  if (error) return error;
  const heroes = await db.heroBanner.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ heroes });
}

export async function POST(request: Request) {
  const { error } = await requireCMSAccess();
  if (error) return error;

  try {
    const data = heroSchema.parse(await request.json());
    const hero = await db.heroBanner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        ctaLabel: data.ctaLabel,
        ctaHref: data.ctaHref,
        backgroundImageUrl: data.backgroundImageUrl,
        active: data.active ?? true,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        endsAt: data.endsAt ? new Date(data.endsAt) : null
      }
    });
    revalidatePath("/");
    return NextResponse.json(hero, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const { error } = await requireCMSAccess();
  if (error) return error;

  const body = await request.json();
  const { id, ...rest } = body;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    const data = heroSchema.partial().parse(rest);
    const hero = await db.heroBanner.update({
      where: { id },
      data: {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        endsAt: data.endsAt ? new Date(data.endsAt) : undefined
      }
    });
    revalidatePath("/");
    return NextResponse.json(hero);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
