import { z } from 'zod';
import schema from './schema';
import { adminProcedure, publicProcedure, router } from '../../trpc';

export const platformRouter = router({
  create: adminProcedure.input(schema).mutation(({ input, ctx }) =>
    ctx.prisma.platform.create({
      data: input,
    })
  ),
  update: adminProcedure
    .input(schema.partial().extend({ id: z.number() }))
    .mutation(({ input, ctx }) => {
      const { id, ...rest } = input;
      return ctx.prisma.platform.update({ where: { id }, data: rest });
    }),
  'get-all': publicProcedure.query(({ ctx }) => ctx.prisma.platform.findMany()),
  'by-id': publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ input, ctx }) =>
      ctx.prisma.platform.findFirst({ where: { id: input.id } })
    ),
  count: publicProcedure.query(({ ctx }) =>
    ctx.prisma.platform.findMany({
      include: {
        _count: {
          select: { games: true },
        },
      },
      orderBy: [
        {
          manufacturer: 'asc',
        },
        { name: 'asc' },
      ],
    })
  ),
});
