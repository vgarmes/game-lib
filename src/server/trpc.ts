import { TRPCError, initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
      },
    };
  },
});

export const router = t.router;
export const mergeRouters = t.mergeRouters;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

const isAuthed = middleware(async ({ ctx, next }) => {
  if (!ctx.isAuthed) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({ ctx });
});

export const protectedProcedure = publicProcedure.use(isAuthed);
