"use client";

import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { Games, Game } from "@/types/trpc";
import { ImageIcon } from "lucide-react";

interface props {
  games: Games;
}
const GameList = ({ games }: props) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] md:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] justify-items-center">
      {games.map((game) => {
        return (
          <div
            key={game.id}
            className="group flex cursor-pointer flex-col items-center mb-6"
          >
            <div className="flex justify-center h-28 w-28 transition-transform group-hover:scale-110">
              {game.cover?.secureUrl ? (
                <Image
                  alt={`${game.title} cover`}
                  src={game.cover.secureUrl}
                  width={game.cover.width}
                  height={game.cover.height}
                  style={{
                    objectFit: "contain",
                  }}
                  className="w-auto h-full rounded"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-zinc-100 dark:bg-zinc-900 rounded">
                  <ImageIcon />
                </div>
              )}
            </div>

            <h1 className="text-center p-3 text-sm font-bold tracking-tight">
              {game.title}
            </h1>
          </div>
        );
      })}
    </div>
  );
};

export default GameList;
