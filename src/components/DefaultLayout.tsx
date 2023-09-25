import Head from 'next/head';
import { ReactNode } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Header } from './header';
import Sidebar from './sidebar';

type DefaultLayoutProps = { children: ReactNode };

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="max-w-7xl px-1 md:px-6 mx-auto w-full">
      <Head>
        <title>Game library</title>
        <meta name="description" content="Victor game library" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="mx-auto w-full px-4 pb-10 flex items-start">
        <div className="sticky top-0 max-h-[calc(100dvh - 4rem)] w-56">
          <Sidebar />
        </div>
        <div className="grow">{children}</div>
      </div>
      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </div>
  );
};

export default DefaultLayout;
