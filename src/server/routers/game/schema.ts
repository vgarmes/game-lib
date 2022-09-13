import { z } from 'zod';

export const newGameSchema = z.object({
  title: z.string(),
  inCollection: z.boolean().nullable(),
  completed: z.boolean().nullable(),
  edition: z.string().nullable(),
  releaseDate: z.date().nullable(),
  completedData: z.date().nullable(),
  buyDate: z.date().nullable(),
  buyPrice: z.number().nullable(),
  developerId: z.number().nullable(),
  rating: z.number().nullable(),
  comment: z.string().nullable(),
  platformId: z.number().nullable(),
});
