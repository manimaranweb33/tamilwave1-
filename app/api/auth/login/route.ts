import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/auth/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const limit = checkRateLimit(`login:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
  }

  return NextResponse.json({ error: "Use NextAuth signIn at /api/auth" }, { status: 405 });
}
