import { trpc } from "@/trpc/client";

export function useIsAuthed() {
  const { data } = trpc.auth.me.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  return data?.isAuthed ?? false;
}
