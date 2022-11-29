import { z } from 'zod';
import { createProtectedRouter, createRouter } from '../../createRouter';
import schema from './schema';

const protectedRouter = createProtectedRouter('ADMIN')
  .mutation('create', {
    input: schema,
    async resolve({ input, ctx }) {
      return ctx.prisma.platform.create({
        data: input,
      });
    },
  })
  .mutation('update', {
    input: schema.partial().extend({ id: z.number() }),
    async resolve({ input, ctx }) {
      const { id, ...rest } = input;
      return ctx.prisma.platform.update({ where: { id }, data: rest });
    },
  });

export const platformRouter = createRouter()
  .query('get-all', {
    async resolve({ ctx }) {
      return ctx.prisma.platform.findMany();
    },
  })
  .query('by-id', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input, ctx }) {
      return ctx.prisma.platform.findFirst({ where: { id: input.id } });
    },
  })
  .merge(protectedRouter);
