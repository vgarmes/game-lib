import { AppRouter } from '@/server/routers/_app';
import type {
  inferProcedureInput,
  inferProcedureOutput,
  inferRouterInputs,
  inferRouterOutputs,
} from '@trpc/server';
import { NextPageContext } from 'next';

export interface SSRContext extends NextPageContext {
  status?: number;
}

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export type Games = RouterOutput['game']['search'];
export type Game = Games[number];

export type inferMutationOutput<
  TRouteKey extends keyof AppRouter['_def']['mutations']
> = inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>;

export type inferMutationInput<
  TRouteKey extends keyof AppRouter['_def']['mutations']
> = inferProcedureInput<AppRouter['_def']['mutations'][TRouteKey]>;
