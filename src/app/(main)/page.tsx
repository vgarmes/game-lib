import GameList from "@/components/GameList";
import PageTitle from "@/components/page-title";
import { Separator } from "@/components/ui/separator";
import prisma from "@/server/prisma";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

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
    <div className="px-4 lg:px-6">
      <section>
        <h2 className="pb-4 text-xl font-medium tracking-tight">
          Recently completed
        </h2>
        <div className="no-scrollbar flex flex-nowrap gap-2 overflow-x-auto py-2">
          {finishedGames.map((game) => {
            return (
              <div
                key={game.id}
                className="group relative mb-6 flex cursor-pointer flex-col items-center"
              >
                <Link href={`/games/${game.id}`} className="absolute inset-0" />
                <div className="flex h-28 w-28 justify-center transition-transform group-hover:scale-110">
                  {game.cover?.secureUrl ? (
                    <Image
                      alt={`${game.title} cover`}
                      src={game.cover.secureUrl}
                      width={game.cover.width}
                      height={game.cover.height}
                      style={{
                        objectFit: "contain",
                      }}
                      className="h-full w-auto rounded"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded bg-zinc-100 dark:bg-zinc-900">
                      <ImageIcon />
                    </div>
                  )}
                </div>

                <h1 className="p-3 text-center text-sm font-bold tracking-tight">
                  {game.title}
                </h1>
              </div>
            );
          })}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold tracking-tight">
          Recently added
        </h2>
        <p className="text-muted-foreground text-sm">
          The games I have recently added to my library.
        </p>
        <Separator className="my-4" />
        <GameList games={addedGames} />
      </section>
    </div>
  );
}
