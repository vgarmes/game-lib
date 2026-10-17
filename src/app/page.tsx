import prisma from "@/server/prisma";
import { PageLayout } from "@/components/page-layout";
import { GamesSummary } from "./games-summary";
import { AddGameButton } from "@/components/add-game-button";
import { SnippetGrid } from "@/components/snippets/snippet-grid";
import { RecentlyBoughtCard } from "@/components/snippets/recently-bought-card";
import { CompletedGamesCard } from "@/components/snippets/completed-games-card";

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
      <SnippetGrid className="grid-cols-1 px-4 [grid-template-areas:'bought'_'completed'] lg:px-6 @5xl/main:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @5xl/main:[grid-template-areas:'bought_completed']">
        <div className="[grid-area:bought]">
          <RecentlyBoughtCard games={boughtGames} />
        </div>
        <div className="[grid-area:completed]">
          <CompletedGamesCard games={finishedGames} />
        </div>
      </SnippetGrid>
      <GamesSummary addedGames={addedGames} />
    </PageLayout>
  );
}
