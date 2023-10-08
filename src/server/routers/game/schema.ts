import { z } from 'zod';

const game = z.object({
  title: z.string().min(1),
  inCollection: z.boolean(),
  completed: z.boolean(),
  edition: z.string().optional(),
  releaseDate: z.date().optional(),
  completedDate: z.date().optional(),
  buyDate: z.date().optional(),
  buyPrice: z.number().optional(),
  developerId: z.number().optional(),
  rating: z.number().optional(),
  comment: z.string().optional(),
  platformId: z.number().optional(),
  coverId: z.number().optional(),
});

export type GameSchema = z.infer<typeof game>;

export default game;
