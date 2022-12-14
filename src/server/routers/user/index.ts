import { TRPCError } from '@trpc/server';
import { hashPassword } from '../../../utils/auth';
import { createRouter } from '../../createRouter';
import { signupSchema } from './schema';

export const userRouter = createRouter().mutation('signup', {
  input: signupSchema,
  async resolve({ input, ctx }) {
    const passwordHash = await hashPassword(input.password);
    const user = await ctx.prisma.user.create({
      data: { username: input.username, email: input.email, passwordHash },
    });
    return { user: user.username, email: user.email, role: user.role };
  },
});
