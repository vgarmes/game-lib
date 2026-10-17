"use client";

import { useState } from "react";
import { Game } from "@/types/trpc";
import { GameRow } from "@/components/game-row";
import { EditGameDrawer } from "@/components/edit-game-drawer";
import { useIsAuthed } from "@/utils/hooks/use-is-authed";

interface Props {
  games: Game[];
  rowClassName?: string;
}

// List of game rows with an edit drawer for authed users.
export function EditableGameList({ games, rowClassName }: Props) {
  const isAuthed = useIsAuthed();
  const [editGameId, setEditGameId] = useState<number | null>(null);

  const editGame = games.find((game) => game.id === editGameId);

  return (
    <>
      <div className="flex flex-col gap-2 md:gap-0">
        {games.map((game) => (
          <GameRow
            key={game.id}
            game={game}
            className={rowClassName}
            onEdit={isAuthed ? setEditGameId : undefined}
          />
        ))}
      </div>
      <EditGameDrawer
        open={!!editGame}
        game={editGame}
        onClose={() => setEditGameId(null)}
      />
    </>
  );
}
