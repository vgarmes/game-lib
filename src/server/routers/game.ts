import { z } from 'zod';
import { createRouter } from '../createRouter';
import { prisma } from '../prisma';

export const gameRouter = createRouter().query('all', {
  input: z.object({
    skip: z.number().nonnegative().nullish(),
    take: z.number().positive().nullish(),
    searchQuery: z.string().optional(),
  }),
  async resolve({ input }) {
    const skip = input.skip ?? 0;
    const take = input.take ?? 50;

    return prisma?.game.findMany({
      skip,
      take,
      include: { cover: { select: { secureUrl: true } } },
      orderBy: { completedDate: 'desc' },
      where: {
        completed: true,
      },
    });
  },
});
