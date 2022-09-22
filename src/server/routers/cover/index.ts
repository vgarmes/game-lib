import { z } from 'zod';
import { createProtectedRouter, createRouter } from '../../createRouter';

const protectedCoverRouter = createProtectedRouter('ADMIN').mutation('create', {
  input: z.object({
    publicId: z.string(),
    secureUrl: z.string(),
    filename: z.string(),
    format: z.string(),
    byteSize: z.number(),
    checksum: z.string(),
    gameId: z.number().optional(),
  }),
  async resolve({ input, ctx }) {
    return ctx.prisma.cover.create({
      data: input,
    });
  },
});

export const coverRouter = createRouter().merge(protectedCoverRouter);
