import prisma from "@/server/prisma";
import { PageLayout } from "@/components/page-layout";
import { GamesSummary } from "./games-summary";
import { AddGameButton } from "@/components/add-game-button";
import { SnippetGrid } from "@/components/snippets/snippet-grid";
import { RecentlyBoughtCard } from "@/components/snippets/recently-bought-card";

export default async function HomePage() {
  const [finishedGames, addedGames, boughtGames] = await prisma.$transaction([
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
    prisma.game.findMany({
      where: { buyDate: { not: null }, cover: { isNot: null } },
      select: {
        id: true,
        title: true,
        cover: { select: { secureUrl: true, width: true, height: true } },
      },
      orderBy: [{ buyDate: "desc" }, { createdAt: "desc" }],
      take: 6,
    }),
  ]);

  return (
    <PageLayout breadcrumbs={undefined} actions={<AddGameButton />}>
      <SnippetGrid className="px-4 lg:px-6">
        <RecentlyBoughtCard games={boughtGames} />
      </SnippetGrid>
      <GamesSummary finishedGames={finishedGames} addedGames={addedGames} />
    </PageLayout>
  );
}
