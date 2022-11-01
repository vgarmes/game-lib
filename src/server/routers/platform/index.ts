import { createProtectedRouter, createRouter } from '../../createRouter';
import schema from './schema';

const protectedRouter = createProtectedRouter('ADMIN').mutation('create', {
  input: schema,
  async resolve({ input, ctx }) {
    return ctx.prisma.platform.create({
      data: input,
    });
  },
});

export const platformRouter = createRouter()
  .query('get-all', {
    async resolve({ ctx }) {
      return ctx.prisma.platform.findMany();
    },
  })
  .merge(protectedRouter);
