import { z } from 'zod';
import schema from './schema';
import { adminProcedure, publicProcedure, router } from '../../trpc';

const MAX_RESULTS = 100;

export const gameRouter = router({
  create: adminProcedure.input(schema).mutation(async ({ input, ctx }) => {
    const { coverId, ...rest } = input;
    await ctx.prisma.game.create({
      data: {
        ...rest,
        cover: coverId ? { connect: { id: coverId } } : undefined,
      },
    });
    await Promise.all([
      ctx.res.revalidate('/'),
      ctx.res.revalidate('/platforms'),
    ]);
    return { sucess: true };
  }),
  update: adminProcedure
    .input(schema.partial().extend({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { id, coverId, ...rest } = input;
      await ctx.prisma.game.update({
        where: {
          id,
        },
        data: {
          ...rest,
          cover: coverId ? { connect: { id: coverId } } : undefined,
        },
      });
    }),
  completed: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative().nullish(),
        take: z.number().positive().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const skip = input.skip ?? 0;
      const take = input.take ?? 50;
      return ctx.prisma.game.findMany({
        skip,
        take,
        include: {
          cover: { select: { id: true, secureUrl: true } },
          platform: { select: { id: true, name: true } },
        },
        orderBy: { completedDate: 'desc' },
        where: {
          completed: true,
        },
      });
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ input, ctx }) =>
      ctx.prisma.game.findFirst({
        where: {
          id: input.id,
        },
        include: {
          cover: { select: { id: true, secureUrl: true } },
          platform: { select: { id: true, name: true } },
        },
      })
    ),
  search: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative().nullish(),
        take: z.number().positive().nullish(),
        query: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      const skip = input.skip ?? 0;
      const take = input.take ? Math.min(input.take, MAX_RESULTS) : 50;
      return ctx.prisma.game.findMany({
        skip,
        take,
        include: {
          cover: { select: { id: true, secureUrl: true } },
          platform: { select: { id: true, name: true } },
        },
        where: {
          title: {
            contains: input.query,
            mode: 'insensitive',
          },
        },
      });
    }),
  byPlatformId: publicProcedure
    .input(
      z.object({
        id: z.number(),
        skip: z.number().nonnegative().nullish(),
        take: z.number().positive().nullish(),
      })
    )
    .query(({ input, ctx }) => {
      const skip = input.skip ?? 0;
      const take = input.take ? Math.min(input.take, MAX_RESULTS) : 50;
      return ctx.prisma.game.findMany({
        skip,
        take,
        include: {
          cover: { select: { id: true, secureUrl: true } },
          platform: { select: { id: true, name: true } },
        },
        where: {
          platformId: {
            equals: input.id,
          },
        },
        orderBy: {
          title: 'asc',
        },
      });
    }),
});
