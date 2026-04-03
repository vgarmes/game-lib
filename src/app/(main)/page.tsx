import prisma from "@/server/prisma";
import { GameCarousel } from "@/components/game-carousel";
import { PageLayout } from "@/components/page-layout";

export default async function HomePage() {
  const [finishedGames, addedGames] = await prisma.$transaction([
    prisma.game.findMany({
      where: { completed: true },
      include: {
        cover: {
          select: { id: true, secureUrl: true, width: true, height: true },
        },
        platform: { select: { id: true, name: true } },
      },
      orderBy: { completedDate: "desc" },
      take: 10,
    }),
    prisma.game.findMany({
      include: {
        cover: {
          select: { id: true, secureUrl: true, width: true, height: true },
        },
        platform: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <PageLayout breadcrumbs={undefined}>
      <section>
        <h2 className="px-4 pb-4 text-xl font-medium tracking-tight lg:px-6">
          Recently completed
        </h2>
        <GameCarousel games={finishedGames} />
      </section>
      <section>
        <h2 className="px-4 pb-4 text-xl font-medium tracking-tight lg:px-6">
          Recently added
        </h2>
        <GameCarousel games={addedGames} />
      </section>
    </PageLayout>
  );
}
