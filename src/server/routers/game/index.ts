import { z } from 'zod';
import schema from './schema';
import { adminProcedure, publicProcedure, router } from '../../trpc';
import { routes } from '@/constants';

const MAX_RESULTS = 100;

const revalidateStaticPages = async (
  revalidator: (urlPath: string) => Promise<void>
) => {
  return Promise.all([
    revalidator(routes['Home']),
    revalidator(routes['Library']),
  ]);
};

export const gameRouter = router({
  create: adminProcedure.input(schema).mutation(async ({ input, ctx }) => {
    const { coverId, ...rest } = input;
    await ctx.prisma.game.create({
      data: {
        ...rest,
        cover: coverId ? { connect: { id: coverId } } : undefined,
      },
    });
    await revalidateStaticPages(ctx.res.revalidate);
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
      await revalidateStaticPages(ctx.res.revalidate);
      return { success: true };
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
        cursor: z.number().nonnegative().nullish(),
        limit: z.number().positive().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      console.log('cursor: ', input.cursor);
      const cursor = input.cursor ?? 0;
      const limit = input.limit ? Math.min(input.limit, MAX_RESULTS) : 50;
      const items = await ctx.prisma.game.findMany({
        skip: cursor * limit,
        take: limit + 1,
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
      let nextPage: typeof input.cursor | undefined = undefined;
      if (items.length > limit) {
        items.pop();
        nextPage = cursor + 1;
      }

      return {
        items,
        nextPage,
      };
    }),
});
