import { router } from '../trpc';
import { coverRouter } from './cover';
import { gameRouter } from './game';
import { platformRouter } from './platform';
import { userRouter } from './user';

const appRouter = router({
  user: userRouter,
  game: gameRouter,
  platform: platformRouter,
  cover: coverRouter,
});

export type AppRouter = typeof appRouter;
