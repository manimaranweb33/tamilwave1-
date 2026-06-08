import { ContentStatus, ContentType, PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { mediaItems } from "../lib/catalog-data";
import { ensureHomepageSections } from "../lib/admin/homepage-service";
import { DEFAULT_STREAMING_PLATFORMS } from "../lib/admin/ensure-platforms";

const prisma = new PrismaClient();
const typeMap: Record<string, ContentType> = {
  Movie: ContentType.MOVIE,
  "Web Series": ContentType.WEB_SERIES,
  Dubbed: ContentType.DUBBED_MOVIE
};

async function main() {
  for (const platform of DEFAULT_STREAMING_PLATFORMS) {
    await prisma.platform.upsert({
      where: { slug: platform.slug },
      update: { name: platform.name },
      create: { name: platform.name, slug: platform.slug }
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
    update: { role: UserRole.ADMIN },
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash,
      role: UserRole.ADMIN
    }
  });

  const editorEmail = process.env.EDITOR_EMAIL ?? "editor@tamilwave.local";
  const editorPassword = process.env.EDITOR_PASSWORD ?? "changeme123";
  const editorHash = await bcrypt.hash(editorPassword, 12);

  await prisma.user.upsert({
    where: { email: editorEmail },
    update: { role: UserRole.EDITOR },
    create: {
      email: editorEmail,
      name: "Editor",
      passwordHash: editorHash,
      role: UserRole.EDITOR
    }
  });

  console.log(`Seeded ${mediaItems.length} content items. Admin: ${adminEmail}, Editor: ${editorEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
