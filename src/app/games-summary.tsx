"use client";

import { useState } from "react";
import { Game } from "@/types/trpc";
import { GameRow } from "@/components/game-row";
import { GameSheet } from "@/components/game-sheet";

interface Props {
  finishedGames: Game[];
  addedGames: Game[];
}

const priceFormatter = Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function GamesSummary({ finishedGames, addedGames }: Props) {
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

  const selectedGame = [...finishedGames, ...addedGames].find(
    (game) => game.id === selectedGameId,
  );

  return (
    <div className="flex flex-col gap-8 px-4 lg:px-6">
      <section>
        <h2 className="pb-4 text-xl font-semibold tracking-tight">
          Recently completed
        </h2>
        <div className="flex flex-col gap-2 md:gap-0">
          {finishedGames.map((game) => (
            <GameRow key={game.id} game={game} onClick={setSelectedGameId} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="pb-4 text-xl font-medium tracking-tight">
          Recently added
        </h2>
        <div className="flex flex-col gap-2 md:gap-0">
          {addedGames.map((game) => (
            <GameRow key={game.id} game={game} onClick={setSelectedGameId} />
          ))}
        </div>
      </section>
      <GameSheet
        open={!!selectedGame}
        game={selectedGame}
        onClose={() => setSelectedGameId(null)}
      />
    </div>
  );
}
