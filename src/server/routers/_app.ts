import { router } from '../trpc';
import { authRouter } from './auth';
import { coverRouter } from './cover';
import { gameRouter } from './game';
import { platformRouter } from './platform';

export const appRouter = router({
  auth: authRouter,
  game: gameRouter,
  platform: platformRouter,
  cover: coverRouter,
});

export type AppRouter = typeof appRouter;
