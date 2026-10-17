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
        {/* The frame carries the table outline, so rows drop their own. Its
            background matches the rows so the fades below blend into it. */}
        <div className="md:bg-background-100 md:overflow-hidden md:rounded-lg md:border @5xl/main:absolute @5xl/main:inset-0">
          {/* Masked rather than overlaid so rows fade out over whatever is
              behind them; 16px matches the rows' vertical padding. */}
          <div className="@5xl/main:h-full @5xl/main:overflow-y-auto @5xl/main:[mask-image:linear-gradient(to_bottom,transparent,black_16px,black_calc(100%-16px),transparent)]">
            <EditableGameList
              games={games}
              rowClassName="md:rounded-none md:border-x-0 md:first:rounded-none md:first:border-t-0 md:last:rounded-none md:last:border-b-0"
            />
          </div>
        </div>
      </div>
    </SnippetCard>
  );
}
