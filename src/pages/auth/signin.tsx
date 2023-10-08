import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Input } from '../../components/ui/input';
import LoadingScreen from '../../components/common/LoadingScreen';
import Title from '../../components/common/Title';
import useZodForm from '../../utils/hooks/useZodForm';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const { data: session, status } = useSession();

  const form = useZodForm({
    schema: z.object({
      email: z.string().email('Not a valid email').min(1),
      password: z.string().min(1),
    }),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

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

  if (status !== 'unauthenticated') {
    if (status === 'authenticated') {
      router.push('/games');
    }
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            handleSignIn(values.email, values.password)
          )}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="" type="password" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignIn;
