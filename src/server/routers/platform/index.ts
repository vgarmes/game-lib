import { z } from 'zod';
import schema from './schema';
import { protectedProcedure, publicProcedure, router } from '../../trpc';
import { revalidatePath } from 'next/cache';
import { routes } from '@/constants';

export const platformRouter = router({
  create: protectedProcedure.input(schema).mutation(async ({ input, ctx }) => {
    const result = await ctx.prisma.platform.create({ data: input });
    revalidatePath(routes['Platforms']);
    return result;
  }),
  update: protectedProcedure
    .input(schema.partial().extend({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...rest } = input;
      const result = await ctx.prisma.platform.update({
        where: { id },
        data: rest,
      });
      revalidatePath(routes['Platforms']);
      return result;
    }),
  all: publicProcedure.query(({ ctx }) => ctx.prisma.platform.findMany()),
  byId: publicProcedure
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
