import { createRouter } from '../createRouter';
import superjson from 'superjson';
import { gameRouter } from './game';
import { userRouter } from './user';
import { platformRouter } from './platform';
import { coverRouter } from './cover';

export const appRouter = createRouter()
  .transformer(superjson)
  .query('healthz', {
    async resolve() {
      return 'yay!';
    },
  })
  .merge('game.', gameRouter)
  .merge('platform.', platformRouter)
  .merge('user.', userRouter)
  .merge('cover.', coverRouter);

export type AppRouter = typeof appRouter;
