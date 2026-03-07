import 'server-only';
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cache } from 'react';
import { makeQueryClient } from './query-client';
import { appRouter } from '@/server/routers/_app';
import { createCallerFactory } from '@/server/trpc';
import { createContext } from '@/server/context';

export const getQueryClient = cache(makeQueryClient);

const callerFactory = createCallerFactory(appRouter);

// Cache the context per request using React cache
const getContext = cache(createContext);

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  callerFactory(getContext),
  getQueryClient
);
