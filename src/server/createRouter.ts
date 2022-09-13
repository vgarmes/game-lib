import { Context } from './context';
import * as trpc from '@trpc/server';
import { Role } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export function createRouter() {
  return trpc.router<Context>();
}

export function createProtectedRouter(role?: Role) {
  return trpc.router<Context>().middleware(async ({ ctx, next }) => {
    if (!ctx.session || (role && ctx.session.user.role !== role)) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next({ ctx: { ...ctx, session: ctx.session } });
  });
}
