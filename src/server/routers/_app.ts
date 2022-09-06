import { createRouter } from '../createRouter';
import superjson from 'superjson';
import { generateSignature } from '../../utils/cloudinary';
import { gameRouter } from './game';
import { userRouter } from './user';

export const appRouter = createRouter()
  .transformer(superjson)
  .query('healthz', {
    async resolve() {
      return 'yay!';
    },
  })
  .query('uploadSignature', {
    async resolve() {
      return generateSignature();
    },
  })
  .merge('game.', gameRouter)
  .merge('user.', userRouter);

export type AppRouter = typeof appRouter;
