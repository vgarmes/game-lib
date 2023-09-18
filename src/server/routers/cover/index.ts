import { adminProcedure, router } from '../../trpc';
import { z } from 'zod';

export const coverRouter = router({
  create: adminProcedure
    .input(
      z.object({
        publicId: z.string(),
        secureUrl: z.string(),
        filename: z.string(),
        format: z.string(),
        byteSize: z.number(),
        width: z.number(),
        height: z.number(),
        checksum: z.string(),
        gameId: z.number().optional(),
      })
    )
    .mutation(({ input, ctx }) =>
      ctx.prisma.cover.create({
        data: input,
      })
    ),
  delete: adminProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ input, ctx }) =>
      ctx.prisma.cover.delete({
        where: {
          id: input.id,
        },
      })
    ),
});
