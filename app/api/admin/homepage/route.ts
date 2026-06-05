import { NextResponse } from "next/server";
import { HomepageSectionKey } from "@prisma/client";
import { requireAdminSession, requireEditorSession } from "@/lib/admin/session";
import { getHomepageSections, updateSectionSlots } from "@/lib/admin/homepage-service";
import { homepageUpdateSchema } from "@/lib/validations/homepage";
import { HOMEPAGE_SECTION_LIMITS } from "@/lib/homepage-config";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  const sections = await getHomepageSections();
  return NextResponse.json({ sections });
}

export async function PATCH(request: Request) {
  const { error } = await requireEditorSession();
  if (error) return error;

  try {
    const body = homepageUpdateSchema.parse(await request.json());
    const maxSlots = HOMEPAGE_SECTION_LIMITS[body.sectionKey as HomepageSectionKey];
    if (maxSlots != null && body.slots.length > maxSlots) {
      return NextResponse.json({ error: `Maximum ${maxSlots} slots allowed` }, { status: 400 });
    }
    const sections = await updateSectionSlots(
      body.sectionKey as HomepageSectionKey,
      body.slots
    );
    revalidatePath("/");
    return NextResponse.json({ sections });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
