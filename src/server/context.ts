import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { nextAuthOptions } from '../pages/api/auth/[...nextauth]';
import { unstable_getServerSession as getServerSession } from 'next-auth/next';

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  const req = opts.req;
  const res = opts.res;

  const session = opts && (await getServerSession(req, res, nextAuthOptions));

  return {
    req,
    res,
    session,
    prisma,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
