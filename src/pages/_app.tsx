import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import DefaultLayout from '@/components/layout/default';
import { trpc } from '@/utils/trpc';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers';

export const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        storageKey="color-mode"
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <DefaultLayout>
          <Component {...pageProps} />
          <Toaster />
        </DefaultLayout>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
