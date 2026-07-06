import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/stars";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Game } from "@/types/trpc";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export function GameRow({
  game,
  onEdit,
}: {
  game: Game;
  /** When provided (admin only), renders an edit button for the row. */
  onEdit?: (gameId: number) => void;
}) {
  return (
    <div
      className={cn(
        "bg-background-100 relative flex flex-col gap-4 overflow-hidden rounded-lg border p-4 md:grid md:grid-cols-[3fr_1fr_minmax(0,100px)] md:gap-8 md:rounded-none md:not-last:border-b-0 md:first:rounded-t-lg md:last:rounded-b-lg",
        onEdit &&
          "pr-14 md:grid-cols-[3fr_1fr_minmax(0,100px)_auto] md:pr-4",
      )}
    >
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="relative size-12 shrink-0 overflow-hidden rounded">
          <Image
            alt={game.title}
            src={game.cover?.secureUrl ?? "/placeholder.png"}
            fill
            className="h-full w-full rounded object-cover"
          />
        </div>

        <div className="flex flex-col gap-2 overflow-hidden">
          <div className="flex min-w-0 items-center gap-2">
            <div className="truncate text-sm font-medium">{game.title}</div>
            {game.edition && (
              <Badge variant="secondary" className="shrink">
                <span className="truncate">{game.edition}</span>
              </Badge>
            )}
          </div>
          <div className="text-muted-foreground text-sm">
            {game.platform?.name}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col overflow-hidden md:items-end">
        <Stars activeStar={game.rating ? game.rating - 1 : null} />
      </div>

      <div className="flex w-full justify-between gap-2 overflow-hidden md:flex-col">
        {game.completed ? (
          <div className="text-muted-foreground flex min-w-px flex-col gap-1 overflow-hidden text-sm">
            <div className="-ml-[3px] flex items-center gap-1">
              <span className="flex size-4 shrink-0 items-center justify-center">
                <span className="size-2 flex-none rounded-full bg-green-400" />
              </span>
              <span className="truncate">Completed</span>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground -ml-[3px] flex items-center gap-1 text-sm">
            <span className="flex size-4 shrink-0 items-center justify-center">
              <span className="size-2 flex-none rounded-full bg-neutral-400" />
            </span>
            <span className="truncate">Backlog</span>
          </div>
        )}
        {game.completed && game.completedDate && (
          <span className="text-muted-foreground truncate text-sm">
            {game.completedDate.toLocaleDateString()}
          </span>
        )}
      </div>

      {onEdit && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Edit ${game.title}`}
          onClick={() => onEdit(game.id)}
          className="absolute top-3 right-3 md:static md:self-center md:justify-self-end"
        >
          <Pencil className="size-4" />
        </Button>
      )}
    </div>
  );
}

export function GameRowSkeleton() {
  return (
    <div className="bg-card flex flex-col gap-4 overflow-hidden rounded-lg border p-4 md:grid md:grid-cols-[3fr_1fr_minmax(0,100px)] md:gap-8 md:rounded-none md:not-last:border-b-0 md:first:rounded-t-lg md:last:rounded-b-lg">
      <div className="flex w-full items-center gap-4 overflow-hidden">
        <div className="relative size-12 shrink-0 overflow-hidden rounded">
          <Skeleton className="size-12 rounded" />
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex min-w-0 items-center gap-2">
            <Skeleton className="h-3 w-full max-w-[200px]" />
          </div>
          <Skeleton className="h-3 w-full max-w-20" />
        </div>
      </div>

      <div className="flex w-full flex-col overflow-hidden md:items-end">
        <Skeleton className="h-4 w-26" />
      </div>

      <div className="flex w-full justify-between gap-2 overflow-hidden md:flex-col">
        <Skeleton className="h-3 w-full max-w-25" />
        <Skeleton className="h-3 w-full max-w-20" />
      </div>
    </div>
  );
}
