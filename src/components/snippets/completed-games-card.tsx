import { Game } from "@/types/trpc";
import { EditableGameList } from "@/components/editable-game-list";
import { SnippetCard } from "./snippet-card";

interface Props {
  games: Game[];
}

export function CompletedGamesCard({ games }: Props) {
  return (
    <SnippetCard title="Recently completed">
      {/* Once the grid has columns (@5xl/main on the home page) the list is taken
          out of flow, so the card never grows taller than its row and scrolls. */}
      <div className="relative min-h-0 flex-1">
        {/* The container carries the table outline, so rows drop their own. */}
        <div className="md:overflow-y-auto md:rounded-lg md:border @5xl/main:absolute @5xl/main:inset-0">
          <EditableGameList
            games={games}
            rowClassName="md:rounded-none md:border-x-0 md:first:rounded-none md:first:border-t-0 md:last:rounded-none md:last:border-b-0"
          />
        </div>
      </div>
    </SnippetCard>
  );
}
