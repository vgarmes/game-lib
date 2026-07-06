import { publicProcedure, router } from '../../trpc';

export const authRouter = router({
  me: publicProcedure.query(({ ctx }) => ({ isAuthed: ctx.isAuthed })),
});
