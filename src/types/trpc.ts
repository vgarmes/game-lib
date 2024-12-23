import { AppRouter } from '@/server/routers/_app';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { NextPageContext } from 'next';

export interface SSRContext extends NextPageContext {
  status?: number;
}

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export type Games = RouterOutput['game']['search'];
export type Game = Games[number];
