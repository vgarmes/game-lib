import Head from 'next/head';
import { ReactNode } from 'react';
import Footer from './footer';
import Navbar from './Navbar';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type DefaultLayoutProps = { children: ReactNode };

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="flex flex-col h-screen max-w-7xl px-1 md:px-6 mx-auto w-full">
      <Head>
        <title>Game library</title>
        <meta name="description" content="Victor game library" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="mx-auto w-full flex-1 px-4 pb-10">{children}</div>
      <Footer />
      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </div>
  );
};

export default DefaultLayout;
