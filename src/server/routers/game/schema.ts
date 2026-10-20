import { z } from "zod";
import { GAME_STATUSES } from "@/constants";

const game = z.object({
  title: z.string().min(1),
  inCollection: z.boolean(),
  status: z.enum(GAME_STATUSES),
  edition: z.string().optional(),
  releaseDate: z.date().optional(),
  completedDate: z.date().optional(),
  buyDate: z.date().optional(),
  buyPrice: z.number().optional(),
  developerId: z.number().optional(),
  rating: z.number().optional(),
  comment: z.string().optional(),
  platformId: z.number({ error: "You need to select a platform" }),
  coverId: z.number().optional(),
});

export type GameSchema = z.infer<typeof game>;

export default game;
