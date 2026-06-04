import { NextResponse } from "next/server";

export function requireAdmin(request: Request) {
  const configuredKey = process.env.ADMIN_API_KEY;
  const providedKey = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!configuredKey || providedKey !== configuredKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
