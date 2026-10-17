import { Game } from "@/types/trpc";
import { cn } from "@/lib/utils";
import { EditableGameList } from "@/components/editable-game-list";
import { SnippetCard } from "./snippet-card";

interface Props {
  title: string;
  games: Game[];
  /** Match the height of the grid row (set by sibling cards) and scroll the
   *  rows inside, instead of growing to fit them. */
  fitRow?: boolean;
}

export function GamesTableCard({ title, games, fitRow = false }: Props) {
  return (
    <SnippetCard title={title}>
      {/* With fitRow, once the grid has columns (@3xl/main, see home-grid) the
          list is taken out of flow, so the card never grows taller than its row. */}
      <div className="relative min-h-0 flex-1">
        {/* The frame carries the table outline, so rows drop their own. Its
            background matches the rows so the fades below blend into it. */}
        <div
          className={cn(
            "md:bg-background-100 md:overflow-hidden md:rounded-lg md:border",
            fitRow && "@3xl/main:absolute @3xl/main:inset-0",
          )}
        >
          {/* Masked rather than overlaid so rows fade out over whatever is
              behind them; 16px matches the rows' vertical padding. */}
          <div
            className={cn(
              fitRow &&
                "@3xl/main:h-full @3xl/main:overflow-y-auto @3xl/main:[mask-image:linear-gradient(to_bottom,transparent,black_16px,black_calc(100%-16px),transparent)]",
            )}
          >
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
