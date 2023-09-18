import GameList from '../components/GameList';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { prisma } from '../server/prisma';
import superjson from 'superjson';
import Title from '../components/common/Title';
import { Games } from '@/types/trpc';

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: games } = props;
  const parsedGames = superjson.parse(games) as Games;

  return (
    <div>
      <section>
        <Title className="text-center">Last completed games</Title>
        {games && <GameList games={parsedGames} />}
      </section>
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
