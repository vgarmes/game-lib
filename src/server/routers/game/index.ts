import { z } from 'zod';
import { createProtectedRouter, createRouter } from '../../createRouter';
import { newGameSchema } from './schema';

const protectedGameRouter = createProtectedRouter('ADMIN').mutation('create', {
  input: newGameSchema,
  async resolve({ input, ctx }) {
    const { coverId, ...rest } = input;
    await ctx.prisma.game.create({
      data: {
        ...rest,
        cover: coverId ? { connect: { id: coverId } } : undefined,
      },
    });
    await ctx.res.revalidate('/');
    return { sucess: true };
  },
});

export const gameRouter = createRouter()
  .query('all', {
    input: z.object({
      skip: z.number().nonnegative().nullish(),
      take: z.number().positive().nullish(),
      searchQuery: z.string().optional(),
    }),
    async resolve({ input, ctx }) {
      const skip = input.skip ?? 0;
      const take = input.take ?? 50;

      return ctx.prisma.game.findMany({
        skip,
        take,
        include: { cover: { select: { secureUrl: true } } },
        orderBy: { completedDate: 'desc' },
        where: {
          completed: true,
        },
      });
    },
  })
  .merge(protectedGameRouter);
