import { z } from "zod";

export const slotSchema = z.object({
  contentId: z.string(),
  position: z.number().int().min(0),
  active: z.boolean().optional(),
  overrideTitle: z.string().optional().nullable(),
  overrideImage: z.string().optional().nullable()
});

export const homepageUpdateSchema = z.object({
  sectionKey: z.enum(["HERO", "TRENDING", "TOP_TAMIL_MOVIES", "TOP_DUBBED", "FEATURED"]),
  slots: z.array(slotSchema)
});

export const heroSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaHref: z.string().optional().nullable(),
  backgroundImageUrl: z.string().optional().nullable(),
  active: z.boolean().optional(),
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable()
});
