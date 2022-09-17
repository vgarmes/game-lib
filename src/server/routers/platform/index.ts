import { createProtectedRouter, createRouter } from '../../createRouter';

const protectedRouter = createProtectedRouter('ADMIN');

export const platformRouter = createRouter().query('get-all', {
  async resolve({ ctx }) {
    return ctx.prisma.platform.findMany();
  },
});
