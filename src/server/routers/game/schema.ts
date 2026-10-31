import { z } from "zod";
import { GAME_STATUSES } from "@/constants";

// Clearable fields are nullish: Prisma's update ignores `undefined`, so the
// client sends `null` to clear a value (e.g. a buy date once "Owned" is off).
const game = z.object({
  title: z.string().min(1),
  inCollection: z.boolean(),
  status: z.enum(GAME_STATUSES),
  edition: z.string().nullish(),
  releaseDate: z.date().nullish(),
  completedDate: z.date().nullish(),
  buyDate: z.date().nullish(),
  buyPrice: z.number().nullish(),
  developerId: z.number().optional(),
  rating: z.number().nullish(),
  comment: z.string().nullish(),
  platformId: z.number({ error: "You need to select a platform" }),
  coverId: z.number().optional(),
});

export type GameSchema = z.infer<typeof game>;

export default game;
