import { cookies } from 'next/headers';
import prisma from './prisma';
import { SESSION_COOKIE, verifySessionToken } from './session';

// Context for App Router API routes (fetch adapter) and RSC caller
export const createContext = async () => {
  const cookieStore = await cookies();
  const isAuthed = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  return {
    isAuthed,
    prisma,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
