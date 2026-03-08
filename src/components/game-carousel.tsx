import type { Game } from "@/types/trpc";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface Props {
  games: Game[];
}

export const GameCarousel: React.FC<Props> = ({ games }) => {
  return (
    <div className="relative">
      <div className="no-scrollbar flex flex-nowrap gap-2 overflow-x-auto px-4 py-2 pr-4 lg:px-6">
        {games.map((game) => {
          return (
            <div
              key={game.id}
              className="relative mb-6 flex cursor-pointer flex-col items-start"
            >
              <Link href={`/games/${game.id}`} className="absolute inset-0" />
              <div className="border-border bg-muted flex h-40 w-40 items-center justify-center rounded border p-2">
                {game.cover?.secureUrl ? (
                  <Image
                    alt={`${game.title} cover`}
                    src={game.cover.secureUrl}
                    width={game.cover.width}
                    height={game.cover.height}
                    className="h-full w-auto rounded object-contain"
                  />
                ) : (
                  <ImageIcon className="text-muted-foreground" />
                )}
              </div>

              <h1 className="pt-2 text-left text-sm tracking-tight">
                {game.title}
              </h1>
            </div>
          );
        })}
      </div>
      <div className="from-background absolute top-0 bottom-0 left-0 w-4 bg-linear-to-r to-transparent lg:w-6" />
      <div className="to-background absolute top-0 right-0 bottom-0 w-4 bg-linear-to-r from-transparent lg:w-6" />
    </div>
  );
};
