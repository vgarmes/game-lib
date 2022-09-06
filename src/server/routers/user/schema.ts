import { z } from 'zod';

export const signupSchema = z
  .object({
    username: z.string().max(20),
    email: z.string().email('Not a valid email'),
    password: z
      .string()
      .min(8, 'Password length must be at least 8 characters')
      .regex(new RegExp('.*[A-Z].*'), 'At least one uppercase character')
      .regex(new RegExp('.*[a-z].*'), 'At least one lowercase character')
      .regex(new RegExp('.*[0-9].*'), 'At least one digit')
      .regex(new RegExp('.*[@$!%*#?&].*'), 'At least one special character'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  });
