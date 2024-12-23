import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import { trpc } from '@/utils/trpc';
import { Toaster } from '@/components/ui/toaster';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { siteConfig } from '@/config/site';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import DefaultLayout from '@/components/layout/default';
import { ThemeProvider } from 'next-themes';

type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }> & { Component: NextPageWithLayout }) => {
  // This is necessary because the default layout contains the Sidebar and we want to ensure that its state is preserved during navigation
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

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

        <SidebarProvider>
          {getLayout(<Component {...pageProps} />)}
        </SidebarProvider>
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
