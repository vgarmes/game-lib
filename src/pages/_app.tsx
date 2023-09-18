import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { withTRPC } from '@trpc/next';
import { httpBatchLink } from '@trpc/client';
import { loggerLink } from '@trpc/client/links/loggerLink';
import superjson from 'superjson';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import DefaultLayout from '@/components/DefaultLayout';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import { QueryClient } from '@tanstack/react-query';

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
      ],
      transformer: superjson,
    })
  );
  return (
    <SessionProvider session={session}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </trpc.Provider>
    </SessionProvider>
  );
};

export default App;
