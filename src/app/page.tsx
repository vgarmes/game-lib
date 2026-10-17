import Link from "next/link";
import { ArrowRight } from "lucide-react";
import prisma from "@/server/prisma";
import { PageLayout } from "@/components/page-layout";
import { AddGameButton } from "@/components/add-game-button";
import { SnippetGrid } from "@/components/snippets/snippet-grid";
import { GameRollCard } from "@/components/snippets/game-roll-card";
import { GamesTableCard } from "@/components/snippets/games-table-card";

export default async function HomePage() {
  const [finishedGames, addedGames, rollGames] = await prisma.$transaction([
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
      where: { completed: true, cover: { isNot: null } },
      select: {
        id: true,
        title: true,
        cover: { select: { secureUrl: true, width: true, height: true } },
      },
      orderBy: [
        { completedDate: { sort: "desc", nulls: "last" } },
        { createdAt: "desc" },
      ],
      take: 6,
    }),
  ]);

  return (
    <PageLayout breadcrumbs={undefined} actions={<AddGameButton />}>
      <SnippetGrid className="home-grid px-4 lg:px-6">
        <div className="[grid-area:roll]">
          <GameRollCard title="Just finished" games={rollGames} />
        </div>
        <div className="[grid-area:completed]">
          <GamesTableCard
            title="Completion log"
            games={finishedGames}
            action={
              <Link
                href="/games?status=completed"
                aria-label="View all completed games"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowRight className="size-4" />
              </Link>
            }
            fitRow
          />
        </div>
        <div className="[grid-area:added]">
          <GamesTableCard title="Recently added" games={addedGames} />
        </div>
      </SnippetGrid>
    </PageLayout>
  );
}
