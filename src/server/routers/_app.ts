import { createRouter } from '../createRouter';
import superjson from 'superjson';
import { gameRouter } from './game';
import { userRouter } from './user';
import { platformRouter } from './platform';

export const appRouter = createRouter()
  .transformer(superjson)
  .query('healthz', {
    async resolve() {
      return 'yay!';
    },
  })
  .merge('game.', gameRouter)
  .merge('platform.', platformRouter)
  .merge('user.', userRouter);

export type AppRouter = typeof appRouter;
