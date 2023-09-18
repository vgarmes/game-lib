import Head from 'next/head';
import { ReactNode } from 'react';
import Footer from './footer';
import Navbar from './Navbar';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type DefaultLayoutProps = { children: ReactNode };

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Head>
        <title>Game library</title>
        <meta name="description" content="Victor game library" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="mx-auto min-h-screen max-w-7xl px-4 pb-10">
        {children}
      </div>
      <Footer />
      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  );
};

export default DefaultLayout;
