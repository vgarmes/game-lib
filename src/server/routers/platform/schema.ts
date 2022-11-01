import { z } from 'zod';

const platformSchema = z.object({
  name: z.string(),
  manufacturer: z.string().optional(),
});

export default platformSchema;
