import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/session";
import { isSlugTaken } from "@/lib/admin/content-queries";
import { validateSlug } from "@/lib/validations/content";

export async function GET(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const slug = new URL(request.url).searchParams.get("slug")?.trim() ?? "";
  const excludeId = new URL(request.url).searchParams.get("excludeId") ?? undefined;

  if (!slug) {
    return NextResponse.json({ available: false, message: "Slug is required" });
  }

  const reserved = validateSlug(slug);
  if (reserved) {
    return NextResponse.json({ available: false, message: reserved });
  }

  const taken = await isSlugTaken(slug, excludeId);
  return NextResponse.json({
    available: !taken,
    message: taken ? "Slug already in use" : null
  });
}
