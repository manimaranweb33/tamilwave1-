import { db } from "@/lib/db";

export type PublicPlatform = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
};

const PLACEHOLDER_PLATFORMS: PublicPlatform[] = [
  { id: "netflix", name: "Netflix", slug: "netflix", logoUrl: null },
  { id: "prime", name: "Prime Video", slug: "prime-video", logoUrl: null },
  { id: "hotstar", name: "Disney+ Hotstar", slug: "disney-hotstar", logoUrl: null },
  { id: "sonyliv", name: "Sony LIV", slug: "sony-liv", logoUrl: null },
  { id: "zee5", name: "Zee5", slug: "zee5", logoUrl: null },
  { id: "aha", name: "Aha", slug: "aha", logoUrl: null },
  { id: "sunnxt", name: "Sun NXT", slug: "sun-nxt", logoUrl: null }
];

export async function getPublicPlatforms(): Promise<PublicPlatform[]> {
  try {
    const platforms = await db.platform.findMany({
      orderBy: { name: "asc" },
      take: 12,
      select: { id: true, name: true, slug: true, logoUrl: true }
    });
    if (platforms.length) return platforms;
  } catch {
    // DB optional during dev
  }
  return PLACEHOLDER_PLATFORMS;
}
