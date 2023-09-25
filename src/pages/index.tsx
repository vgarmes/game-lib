import GameList from '../components/GameList';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { prisma } from '../server/prisma';
import superjson from 'superjson';
import Title from '../components/common/Title';
import { Games } from '@/types/trpc';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ScrollBar } from '@/components/ui/scroll-area';
import Image from 'next/image';

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { addedGames, finishedGames } = props;
  const parsedFinishedGames = superjson.parse(finishedGames) as Games;
  const parsedAddedGames = superjson.parse(addedGames) as Games;

  return (
    <div className="px-4 py-6 lg:px-8">
      <section>
        <h2 className="text-2xl font-semibold tracking-tight">
          Recently finished
        </h2>
        <p className="text-sm text-muted-foreground">
          The games I have recently finished.
        </p>
        <Separator className="my-4" />

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
    </div>
  );
};

export async function getStaticProps(context: GetStaticPropsContext) {
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
