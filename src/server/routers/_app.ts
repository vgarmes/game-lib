import { createRouter } from '../createRouter';
import superjson from 'superjson';
import { generateSignature } from '../../utils/cloudinary';
import { gameRouter } from './game';
import { userRouter } from './user';
import { imageRouter } from './image';
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
  .merge('user.', userRouter)
  .merge('image.', imageRouter);

export type AppRouter = typeof appRouter;
