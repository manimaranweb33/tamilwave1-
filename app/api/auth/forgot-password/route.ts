import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { checkRateLimit } from "@/lib/auth/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const limit = checkRateLimit(`forgot:${ip}`, { limit: 3, windowMs: 300_000 });
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: "If an account exists for that email, password reset instructions will be sent."
  });
}
