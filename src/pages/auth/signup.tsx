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

const SignUp = () => {
  const { mutate: signup, isLoading } = trpc.user.signup.useMutation({
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
    <div className="max-w-sm mx-auto">
      <h2 className="text-3xl font-bold pb-6">Sign up</h2>
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

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUp;
