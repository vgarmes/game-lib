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
        <div className="@5xl/main:absolute @5xl/main:inset-0 @5xl/main:overflow-y-auto">
          <EditableGameList games={games} />
        </div>
      </div>
    </SnippetCard>
  );
}
