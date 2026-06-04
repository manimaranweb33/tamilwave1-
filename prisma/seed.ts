import { ContentStatus, ContentType, PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { mediaItems } from "../lib/catalog-data";
import { ensureHomepageSections } from "../lib/admin/homepage-service";

const prisma = new PrismaClient();
const typeMap: Record<string, ContentType> = {
  Movie: ContentType.MOVIE,
  "Web Series": ContentType.WEB_SERIES,
  Dubbed: ContentType.DUBBED_MOVIE
};

const defaultPlatforms = ["Netflix", "Amazon Prime", "Disney+ Hotstar", "Zee5", "Sony LIV"];

async function main() {
  for (const name of defaultPlatforms) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.platform.upsert({
      where: { slug },
      update: {},
      create: { name, slug }
    });
  }

  for (const item of mediaItems) {
    const genreSlug = item.genre.toLowerCase().replace(/\s+/g, "-");
    const genre = await prisma.genre.upsert({
      where: { slug: genreSlug },
      update: {},
      create: { name: item.genre, slug: genreSlug }
    });

    const content = await prisma.content.upsert({
      where: { slug: item.slug },
      update: {
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        posterUrl: item.posterUrl ?? null
      },
      create: {
        slug: item.slug,
        title: item.title,
        tamilTitle: item.tamilTitle,
        description: item.description,
        year: item.year,
        type: typeMap[item.type],
        genre: item.genre,
        quality: item.quality,
        accent: item.accent,
        posterUrl: item.posterUrl ?? null,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date()
      }
    });

    await prisma.contentGenre.upsert({
      where: { contentId_genreId: { contentId: content.id, genreId: genre.id } },
      update: {},
      create: { contentId: content.id, genreId: genre.id }
    });
  }

  await ensureHomepageSections();

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@tamilwave.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme123";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Super Admin",
      passwordHash,
      role: UserRole.SUPER_ADMIN
    }
  });

  console.log(`Seeded ${mediaItems.length} content items. Admin: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
