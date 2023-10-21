import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import { trpc } from '@/utils/trpc';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers';
import RootLayout from '@/components/layout/root';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
        disableTransitionOnChange
      >
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
        <Toaster />
        {process.env.NODE_ENV !== 'production' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </ThemeProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
