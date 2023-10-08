import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import DefaultLayout from '@/components/layout/default';
import { trpc } from '@/utils/trpc';
import { Toaster } from '@/components/ui/toaster';

export const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) => {
  return (
    <SessionProvider session={session}>
      <DefaultLayout>
        <Component {...pageProps} />
        <Toaster />
      </DefaultLayout>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
