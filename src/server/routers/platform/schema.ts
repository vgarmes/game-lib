import { z } from 'zod';

const platform = z.object({
  name: z.string(),
  manufacturer: z.string().nullish(),
});

export default platform;
