import GameList from '@/components/GameList';
import PageTitle from '@/components/page-title';
import { Separator } from '@/components/ui/separator';
import prisma from '@/server/prisma';

export default async function HomePage() {
  const [finishedGames, addedGames] = await prisma.$transaction([
    prisma.game.findMany({
      where: { completed: true },
      include: {
        cover: { select: { id: true, secureUrl: true, width: true, height: true } },
        platform: { select: { id: true, name: true } },
      },
      orderBy: { completedDate: 'desc' },
      take: 10,
    }),
    prisma.game.findMany({
      include: {
        cover: { select: { id: true, secureUrl: true, width: true, height: true } },
        platform: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  return (
    <>
      <section>
        <PageTitle
          title="Recently completed"
          description="Games I have recently finished."
        />
        <GameList games={finishedGames} />
      </section>
      <section>
        <h2 className="text-2xl font-semibold tracking-tight">
          Recently added
        </h2>
        <p className="text-sm text-muted-foreground">
          The games I have recently added to my library.
        </p>
        <Separator className="my-4" />
        <GameList games={addedGames} />
      </section>
    </>
  );
}
