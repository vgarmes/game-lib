import GameList from '../components/GameList';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { prisma } from '../server/prisma';
import superjson from 'superjson';
import Title from '../components/common/Title';
import { Games } from '@/types/trpc';
import { Separator } from '@/components/ui/separator';

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: games } = props;
  const parsedGames = superjson.parse(games) as Games;

  return (
    <div>
      <section>
        <h2 className="text-2xl font-semibold tracking-tight">
          Recently completed
        </h2>
        <p className="text-sm text-muted-foreground">
          The games I have recently completed.
        </p>
        <Separator className="my-4" />
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
