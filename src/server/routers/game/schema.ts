import { z } from 'zod';

const gameSchema = z.object({
  title: z.string(),
  inCollection: z.boolean().optional(),
  completed: z.boolean().optional(),
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

export default gameSchema;
