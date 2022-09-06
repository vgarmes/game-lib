import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import GameList from '../components/GameList';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data: games } = trpc.useQuery(['game.all', { skip: 0, take: 10 }]);
  const { data: session } = useSession();
  return (
    <div>
      <Head>
        <title>Game library</title>
        <meta name="description" content="Victor game library" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section>
        <h1 className="mt-6 pb-6 text-center text-4xl font-extrabold tracking-tight text-white">
          Last completed games
        </h1>
        <GameList games={games} />
      </section>

      <footer></footer>
    </div>
  );
};

export default Home;
