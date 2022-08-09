import { createRouter } from '../createRouter';
import superjson from 'superjson';

export const appRouter = createRouter()
  .transformer(superjson)
  .query('healthz', {
    async resolve() {
      return 'yay!';
    },
  });

export type AppRouter = typeof appRouter;
