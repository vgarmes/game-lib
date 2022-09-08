import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { z } from 'zod';
import useZodForm from '../../utils/hooks/useZodForm';

const SignIn = () => {
  const router = useRouter();
  const methods = useZodForm({
    schema: z.object({
      email: z.string().email('Not a valid email'),
      password: z.string(),
    }),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  return (
    <div>
      <h2 className="text-2xl font-bold">Sign in </h2>
      <form
        onSubmit={methods.handleSubmit(async (values) =>
          signIn<'credentials'>('credentials', {
            redirect: false,
            email: values.email,
            password: values.password,
          }).then((response) => {
            if (response?.ok) {
              return router.push('/');
            }
            console.log(response?.error);
            return;
          })
        )}
      >
        <div>
          <label>
            Email
            <br />
            <input type="email" {...methods.register('email')} />
            {methods.formState.errors.email?.message && (
              <p className="text-red-700">
                {methods.formState.errors.email.message}
              </p>
            )}
          </label>
        </div>

        <div>
          <label>
            Email
            <br />
            <input type="password" {...methods.register('password')} />
            {methods.formState.errors.password?.message && (
              <p className="text-red-700">
                {methods.formState.errors.password.message}
              </p>
            )}
          </label>
        </div>

        <button
          type="submit"
          className="bg-primary-500 border p-2 font-bold text-white"
        >
          Sign in
        </button>
      </form>
    </div>
  );
};

export default SignIn;
