import { hashPassword } from '../../../utils/auth';
import { signupSchema } from './schema';
import { publicProcedure, router } from '../../trpc';

export const userRouter = router({
  signup: publicProcedure
    .input(signupSchema)
    .mutation(async ({ input, ctx }) => {
      const passwordHash = await hashPassword(input.password);
      const user = await ctx.prisma.user.create({
        data: { username: input.username, email: input.email, passwordHash },
      });
      return { user: user.username, email: user.email, role: user.role };
    }),
});
