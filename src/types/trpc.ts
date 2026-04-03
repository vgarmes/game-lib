import { AppRouter } from "@/server/routers/_app";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export type Game = RouterOutput["game"]["search"]["items"][number];
