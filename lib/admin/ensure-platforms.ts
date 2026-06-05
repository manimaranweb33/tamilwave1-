import { db } from "@/lib/db";

export const DEFAULT_STREAMING_PLATFORMS = [
  { name: "Netflix", slug: "netflix" },
  { name: "Prime Video", slug: "prime-video" },
  { name: "Disney+ Hotstar", slug: "disney-hotstar" },
  { name: "Sony LIV", slug: "sony-liv" },
  { name: "Zee5", slug: "zee5" },
  { name: "Aha", slug: "aha" },
  { name: "Sun NXT", slug: "sun-nxt" }
] as const;

export async function ensureDefaultPlatforms() {
  for (const platform of DEFAULT_STREAMING_PLATFORMS) {
    await db.platform.upsert({
      where: { slug: platform.slug },
      update: { name: platform.name },
      create: { name: platform.name, slug: platform.slug }
    });
  }
}
