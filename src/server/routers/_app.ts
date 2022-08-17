import { createRouter } from '../createRouter';
import superjson from 'superjson';
import { generateSignature } from '../../utils/cloudinary';
import { gameRouter } from './game';

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
  .merge('game.', gameRouter);

export type AppRouter = typeof appRouter;
