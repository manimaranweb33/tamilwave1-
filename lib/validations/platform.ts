import { z } from "zod";

export const platformSchema = z.object({
  name: z.string().trim().min(1).max(80),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  logoUrl: z.string().url().optional().nullable().or(z.literal(""))
});

export const platformUpdateSchema = platformSchema.partial();
