import Head from 'next/head';
import { PropsWithChildren } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Header } from '../header';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';

const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: ['Game library', 'vgmestre'],
  authors: [
    {
      name: 'Victor Garcia',
      url: 'https://vgarmes.github.io',
    },
  ],
  creator: 'vgmestre',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [],
    creator: '@vgmestre',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
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
      <div className="max-w-7xl px-3 md:px-6 mx-auto w-full flex flex-col min-h-screen">
        <Header />
        {children}
      </div>
    </>
  );
};

export default RootLayout;
