import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getServerSession } from './common/get-server-session';
import { prisma } from './prisma';

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  const req = opts.req;
  const res = opts.res;

  const session = opts && (await getServerSession(req, res));

  return {
    req,
    res,
    session,
    prisma,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
