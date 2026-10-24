import Image from "next/image";
import { Card } from "@/components/ui/card";

export interface NowPlayingGame {
  id: number;
  title: string;
  platform: { name: string } | null;
  cover: { secureUrl: string } | null;
}

interface Props {
  game: NowPlayingGame | null;
}

// Compact card for the game currently being played: small cover, a "live"
// label and the title/platform. No header, unlike the other snippet cards.
export function NowPlayingCard({ game }: Props) {
  return (
    <Card className="h-full p-4">
      <div className="flex items-center gap-4">
        {game && (
          <div className="bg-muted relative size-16 shrink-0 overflow-hidden rounded">
            <Image
              alt={`${game.title} cover`}
              src={game.cover?.secureUrl ?? "/placeholder.png"}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
              Now playing
            </h2>
            {game && (
              <span aria-hidden className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex size-full rounded-full bg-green-400 opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-green-400" />
              </span>
            )}
          </div>
          {game ? (
            <>
              <div className="truncate text-sm font-medium">{game.title}</div>
              {game.platform && (
                <div className="text-muted-foreground truncate text-sm">
                  {game.platform.name}
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              Nothing in progress.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
