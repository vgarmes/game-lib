import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data } = trpc.useQuery(['healthz']);

  return (
    <div>
      <Head>
        <title>Game library</title>
        <meta name="description" content="Victor game library" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main></main>

      <footer></footer>
    </div>
  );
};

export default Home;
