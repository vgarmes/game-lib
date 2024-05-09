import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { Input } from '../../components/ui/input';
import LoadingScreen from '../../components/common/LoadingScreen';
import useZodForm from '../../utils/hooks/useZodForm';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import PageTitle from '@/components/page-title';
import { useToast } from '@/components/ui/use-toast';
import { routes } from '@/constants';

const SignIn = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { status } = useSession();

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
      toast({
        variant: 'destructive',
        title: 'Email and/or password are invalid',
        description: 'There was a problem with your request.',
      });
      return;
    });

  if (status !== 'unauthenticated') {
    if (status === 'authenticated') {
      router.push(routes.Home);
    }
    return <LoadingScreen />;
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <PageTitle title="Sign in" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            handleSignIn(values.email, values.password)
          )}
          className="flex flex-col gap-6"
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
