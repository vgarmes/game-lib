import { z } from 'zod';

const platform = z.object({
  name: z.string(),
  manufacturer: z.string().optional(),
});

export type PlatformSchema = z.infer<typeof platform>;

export default platform;
