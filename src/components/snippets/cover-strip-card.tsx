import Image from "next/image";
import { SnippetCard } from "./snippet-card";
import { CoverFallback } from "@/components/cover-fallback";

export interface CoverStripItem {
  id: number;
  title: string;
  cover: { secureUrl: string } | null;
}

interface Props {
  title: string;
  games: CoverStripItem[];
}

// Minimal horizontal strip of game covers, newest first.
export function CoverStripCard({ title, games }: Props) {
  return (
    <SnippetCard title={title}>
      {games.length === 0 ? (
        <p className="text-muted-foreground text-sm">No games yet.</p>
      ) : (
        // Focusable so the strip can be scrolled with the keyboard. It bleeds
        // into the card's 16px side padding (-mx-4/px-4) so the edge fades,
        // like the completion log's vertical ones, only cover thumbnails as
        // they scroll past the card edge, never at rest.
        <div
          tabIndex={0}
          role="region"
          aria-label={title}
          className="no-scrollbar focus-visible:ring-ring/50 -mx-4 overflow-x-auto overscroll-x-contain [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] px-4 py-1 outline-none focus-visible:ring-3 focus-visible:ring-inset"
        >
          <ul className="flex w-max gap-4">
            {games.map((game) => (
              <li
                key={game.id}
                title={game.title}
                // Same thumbnail as the completion log rows (GameRow).
                className="relative size-12 shrink-0 overflow-hidden rounded"
              >
                {game.cover ? (
                  <Image
                    alt={game.title}
                    src={game.cover.secureUrl}
                    fill
                    sizes="48px"
                    className="h-full w-full rounded object-cover"
                  />
                ) : (
                  <CoverFallback title={game.title} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </SnippetCard>
  );
}
