import { getServerSession as gSS } from 'next-auth';
import { nextAuthOptions } from '../auth';

// Works in App Router server components, route handlers, and RSC
export const getServerSession = async () => {
  return await gSS(nextAuthOptions);
};
