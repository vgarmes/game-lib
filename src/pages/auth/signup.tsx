import { signIn } from 'next-auth/react';
import { signupSchema } from '../../server/routers/user/schema';
import useZodForm from '../../utils/hooks/useZodForm';
import { trpc } from '../../utils/trpc';

const SignUp = () => {
  const signup = trpc.useMutation('user.signup', {
    onSuccess(_user, variables) {
      signIn('credentials', {
        callbackUrl: '/',
        email: variables.email,
        password: variables.password,
      });
    },
  });
  const methods = useZodForm({
    schema: signupSchema,
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });
  return (
    <div>
      <h2 className="text-2xl font-bold">Sign up</h2>
      <form
        onSubmit={methods.handleSubmit(async (values) => {
          await signup.mutateAsync(values);
          methods.reset();
        })}
      >
        <div>
          <label>
            Name
            <br />
            <input {...methods.register('username')} className="border" />
          </label>
          {methods.formState.errors.username?.message && (
            <p className="text-red-700">
              {methods.formState.errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label>
            Email
            <br />
            <input
              type="email"
              {...methods.register('email')}
              className="border"
            />
          </label>
          {methods.formState.errors.email?.message && (
            <p className="text-red-700">
              {methods.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label>
            Password
            <br />
            <input
              type="password"
              {...methods.register('password')}
              className="border"
            />
          </label>
          {methods.formState.errors.password?.message && (
            <p className="text-red-700">
              {methods.formState.errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label>
            Confirm password
            <br />
            <input
              type="password"
              {...methods.register('passwordConfirm')}
              className="border"
            />
          </label>
          {methods.formState.errors.passwordConfirm?.message && (
            <p className="text-red-700">
              {methods.formState.errors.passwordConfirm.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={signup.isLoading}
          className="bg-primary-500 border p-2 font-bold text-white"
        >
          {signup.isLoading ? 'Loading' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
