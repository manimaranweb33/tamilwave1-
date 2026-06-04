import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/session";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const platforms = await db.platform.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ platforms });
}
