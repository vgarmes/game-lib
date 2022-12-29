import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Button, Input } from '../../components/common';
import LoadingScreen from '../../components/common/LoadingScreen';
import Title from '../../components/common/Title';
import useZodForm from '../../utils/hooks/useZodForm';

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const { data: session, status } = useSession();

  const {
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isSubmitted },
    register,
    trigger,
  } = useZodForm({
    schema: z.object({
      email: z.string().email('Not a valid email').min(1),
      password: z.string().min(1),
    }),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSignIn = async (email: string, password: string) =>
    signIn<'credentials'>('credentials', {
      redirect: false,
      email: email,
      password: password,
    }).then((response) => {
      if (response?.ok) {
        return router.push('/');
      }
      setError('Email or password are invalid');
      return;
    });

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/games');
    }
  }, [status, router]);

  if (status !== 'unauthenticated') {
    return <LoadingScreen />;
  }

  return (
    <div className="mx-auto flex max-w-md flex-col">
      <Title>Sign in</Title>
      {error && (
        <div className="max flex justify-center">
          <p className="rounded border border-red-500 bg-red-200 px-4 py-2 text-red-600">
            {error}
          </p>
        </div>
      )}
      <form
        onSubmit={handleSubmit((values) =>
          handleSignIn(values.email, values.password)
        )}
      >
        <Input
          type="email"
          label="Email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          type="password"
          label="Password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  );
};

export default SignIn;
