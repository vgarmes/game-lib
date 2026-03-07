import { getServerSession } from 'next-auth';
import { nextAuthOptions } from './auth';
import prisma from './prisma';

// Context for App Router API routes (fetch adapter) and RSC caller
export const createContext = async () => {
  const session = await getServerSession(nextAuthOptions);
  return {
    session,
    prisma,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
