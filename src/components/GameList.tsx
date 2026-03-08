"use client";

import Image from "next/image";
import type { Game } from "@/types/trpc";
import { ImageIcon } from "lucide-react";
import Link from "next/link";

interface props {
  games: Game[];
}
const GameList = ({ games }: props) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] justify-items-center md:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]">
      {games.map((game) => {
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
  );
};

export default GameList;
