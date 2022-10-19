import { z } from 'zod';

const gameSchema = z.object({
  title: z.string(),
  inCollection: z.boolean().nullable(),
  completed: z.boolean().nullable(),
  edition: z.string().optional().nullable(),
  releaseDate: z.date().optional().nullable(),
  completedDate: z.date().optional().nullable(),
  buyDate: z.date().optional().nullable(),
  buyPrice: z.number().optional().nullable(),
  developerId: z.number().optional().nullable(),
  rating: z.number().optional().nullable(),
  comment: z.string().optional().nullable(),
  platformId: z.number().optional().nullable(),
  coverId: z.number().optional().nullable(),
});

export default gameSchema;
