import Head from 'next/head';
import GameList, { Games } from '../components/GameList';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { prisma } from '../server/prisma';
import superjson from 'superjson';
import Title from '../components/common/Title';

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: games } = props;
  const parsedGames = superjson.parse(games) as Games;

  return (
    <div>
      <Head>
        <title>Game library</title>
        <meta name="description" content="Victor game library" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section>
        <Title className="text-center">Last completed games</Title>
        {games && <GameList games={parsedGames} />}
      </section>

      <footer></footer>
    </div>
  );
};

export async function getStaticProps(context: GetStaticPropsContext) {
  const games = await prisma.game.findMany({
    where: {
      completed: true,
    },
    include: {
      cover: { select: { secureUrl: true } },
      platform: { select: { name: true } },
    },
    orderBy: { completedDate: 'desc' },
    take: 20,
  });

  return {
    props: {
      data: superjson.stringify(games),
    },
  };
}

export default Home;
