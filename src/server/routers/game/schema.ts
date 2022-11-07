import { z } from 'zod';

const newGame = z.object({
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

export default newGame;

/* export const updateGame = z.object({
  title: z.string().min(1).nullish(),
  inCollection: z.boolean().nullish(),
  completed: z.boolean().nullish(),
  edition: z.string().nullish(),
  releaseDate: z.date().nullish(),
  completedDate: z.date().nullish(),
  buyDate: z.date().nullish(),
  buyPrice: z.number().nullish(),
  developerId: z.number().nullish(),
  rating: z.number().nullish(),
  comment: z.string().nullish(),
  platformId: z.number().nullish(),
  coverId: z.number().nullish(),
}); */
