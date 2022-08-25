import type { NextPage } from 'next';
import Head from 'next/head';
import GameList from '../components/GameList';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data: games } = trpc.useQuery(['game.all', { skip: 0, take: 10 }]);

  return (
    <div>
      <Head>
        <title>Game library</title>
        <meta name="description" content="Victor game library" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <GameList games={games} />
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
