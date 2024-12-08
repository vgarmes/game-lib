import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import { trpc } from '@/utils/trpc';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { siteConfig } from '@/config/site';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';

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
        <Head>
          <title>{siteConfig.name}</title>
          <meta name="description" content={siteConfig.description} />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: light)"
            content="cyan"
          />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: dark)"
            content="black"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
        <Analytics />
        <Toaster />
        {process.env.NODE_ENV !== 'production' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </ThemeProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
