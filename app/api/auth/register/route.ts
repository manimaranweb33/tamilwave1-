import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/credentials";
import { registerSchema } from "@/lib/validations/auth";
import { checkRateLimit } from "@/lib/auth/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const limit = checkRateLimit(`register:${ip}`, { limit: 5, windowMs: 300_000 });
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { name, email, password } = parsed.data;
  const normalized = email.toLowerCase().trim();

  const existing = await db.user.findUnique({ where: { email: normalized } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  await db.user.create({
    data: {
      name,
      email: normalized,
      passwordHash,
      role: "USER"
    }
  });

  return NextResponse.json({ ok: true });
}
