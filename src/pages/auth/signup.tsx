import { signIn } from 'next-auth/react';
import { signupSchema } from '../../server/routers/user/schema';
import useZodForm from '../../utils/hooks/useZodForm';
import { trpc } from '../../utils/trpc';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/page-title';
import { ReactElement } from 'react';

const SignUp = () => {
  const { mutate: signup, isPending } = trpc.user.signup.useMutation({
    onSuccess(_user, variables) {
      signIn('credentials', {
        callbackUrl: '/',
        email: variables.email,
        password: variables.password,
      });
    },
  });
  const form = useZodForm({
    schema: signupSchema,
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  return (
    <div className="mx-auto w-full max-w-md">
      <PageTitle title="Sign up" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => signup(values))}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
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
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign up
          </Button>
        </form>
      </Form>
    </div>
  );
};

SignUp.getLayout = (page: ReactElement) => <>{page}</>;

export default SignUp;
