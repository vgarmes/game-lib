import { Game } from "@/types/trpc";
import { cn } from "@/lib/utils";
import { EditableGameList } from "@/components/editable-game-list";
import { SnippetCard } from "./snippet-card";

interface Props {
  title: string;
  games: Game[];
  /** Rendered on the right of the card header, e.g. a "view all" link. */
  action?: React.ReactNode;
  /** Match the height of the grid row (set by sibling cards) and scroll the
   *  rows inside, instead of growing to fit them. */
  fitRow?: boolean;
}

export function GamesTableCard({
  title,
  games,
  action,
  fitRow = false,
}: Props) {
  return (
    <SnippetCard title={title} action={action}>
      {/* With fitRow, once the grid has columns (@3xl/main, see home-grid) the
          list is taken out of flow, so the card never grows taller than its row. */}
      <div className="relative min-h-0 flex-1">
        {/* The frame carries the table outline at every size, so rows drop
            their own (no separate row cards on small screens). Its
            background matches the rows so the fades below blend into it. */}
        <div
          className={cn(
            "bg-background-100 overflow-hidden rounded-lg border",
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
              className="gap-0"
              rowClassName="rounded-none border-x-0 not-last:border-b-0 first:border-t-0 last:border-b-0 md:first:rounded-none md:last:rounded-none"
            />
          </div>
        </div>
      </div>
    </SnippetCard>
  );
}
