import Head from 'next/head';
import { ReactNode } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Header } from './header';
import Sidebar from './sidebar';
import MobileNav from './mobile-nav';

type DefaultLayoutProps = { children: ReactNode };

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div>
      <div className="max-w-7xl px-3 md:px-6 mx-auto w-full flex flex-col h-[calc(100dvh-64px)] overflow-auto sm:overflow-visible sm:h-screen">
        <Head>
          <title>Game library</title>
          <meta name="description" content="Victor game library" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <div className="mx-auto w-full pb-10 flex items-start grow">
          <div className="sticky top-0 max-h-[calc(100dvh - 4rem)] w-56 hidden sm:block">
            <Sidebar />
          </div>
          <div className="grow h-full">{children}</div>
        </div>

        {process.env.NODE_ENV !== 'production' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </div>
      <div className="block w-full sm:hidden fixed bottom-0">
        <MobileNav />
      </div>
    </div>
  );
};

export default DefaultLayout;
