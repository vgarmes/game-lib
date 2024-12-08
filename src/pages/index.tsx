import GameList from '../components/GameList';
import { InferGetStaticPropsType } from 'next';
import prisma from '../server/prisma';
import superjson from 'superjson';
import { Games } from '@/types/trpc';
import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/page-title';

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { addedGames, finishedGames } = props;
  const parsedFinishedGames = superjson.parse(finishedGames) as Games;
  const parsedAddedGames = superjson.parse(addedGames) as Games;

  return (
    <>
      <section>
        <PageTitle
          title="Recently completed"
          description={'Games I have recently finished.'}
        />

        {finishedGames && <GameList games={parsedFinishedGames} />}
      </section>
      <section>
        <h2 className="text-2xl font-semibold tracking-tight">
          Recently added
        </h2>
        <p className="text-sm text-muted-foreground">
          The games I have recently added to my library.
        </p>
        <Separator className="my-4" />

        {addedGames && <GameList games={parsedAddedGames} />}
      </section>
    </>
  );
};

export async function getStaticProps() {
  const [finishedGames, addedGames] = await prisma.$transaction([
    prisma.game.findMany({
      where: {
        completed: true,
      },
      include: {
        cover: { select: { secureUrl: true } },
        platform: { select: { name: true } },
      },
      orderBy: { completedDate: 'desc' },
      take: 10,
    }),
    prisma.game.findMany({
      include: {
        cover: { select: { secureUrl: true } },
        platform: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  return {
    props: {
      finishedGames: superjson.stringify(finishedGames),
      addedGames: superjson.stringify(addedGames),
    },
  };
}

export default Home;
