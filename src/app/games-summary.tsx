"use client";

import { useState } from "react";
import { Game } from "@/types/trpc";
import { GameRow } from "@/components/game-row";
import { EditGameDrawer } from "@/components/edit-game-drawer";
import { useIsAdmin } from "@/utils/hooks/use-is-admin";

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
  const isAdmin = useIsAdmin();
  const [editGameId, setEditGameId] = useState<number | null>(null);

  const editGame = [...finishedGames, ...addedGames].find(
    (game) => game.id === editGameId,
  );

  return (
    <div className="flex flex-col gap-8 px-4 lg:px-6">
      <section>
        <h2 className="pb-4 text-xl font-semibold tracking-tight">
          Recently completed
        </h2>
        <div className="flex flex-col gap-2 md:gap-0">
          {finishedGames.map((game) => (
            <GameRow
              key={game.id}
              game={game}
              onEdit={isAdmin ? setEditGameId : undefined}
            />
          ))}
        </div>
      </section>
      <section>
        <h2 className="pb-4 text-xl font-medium tracking-tight">
          Recently added
        </h2>
        <div className="flex flex-col gap-2 md:gap-0">
          {addedGames.map((game) => (
            <GameRow
              key={game.id}
              game={game}
              onEdit={isAdmin ? setEditGameId : undefined}
            />
          ))}
        </div>
      </section>
      <EditGameDrawer
        open={!!editGame}
        game={editGame}
        onClose={() => setEditGameId(null)}
      />
    </div>
  );
}
