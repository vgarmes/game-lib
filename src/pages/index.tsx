import Head from 'next/head';
import GameList from '../components/GameList';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { prisma } from '../server/prisma';

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: games } = props;
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
        {games && <GameList games={games} />}
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
    include: { cover: { select: { secureUrl: true } } },
    orderBy: { completedDate: 'desc' },
    take: 20,
  });

  return {
    props: {
      data: games.map(({ id, title, cover }) => ({
        id,
        title,
        coverUrl: cover?.secureUrl,
      })),
    },
  };
}

export default Home;
