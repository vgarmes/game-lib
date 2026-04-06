import prisma from "@/server/prisma";
import { PageLayout } from "@/components/page-layout";
import { GamesSummary } from "./games-summary";

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
      <GamesSummary finishedGames={finishedGames} addedGames={addedGames} />
    </PageLayout>
  );
}
