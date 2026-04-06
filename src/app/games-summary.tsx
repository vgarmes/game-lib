"use client";

import { Stars } from "@/components/stars";
import { Badge } from "@/components/ui/badge";
import { Game } from "@/types/trpc";
import { Coins, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  return (
    <div className="flex flex-col gap-8 px-4 lg:px-6 xl:flex-row">
      <section>
        <h2 className="pb-4 text-xl font-semibold tracking-tight">
          Recently completed
        </h2>
        <div className="flex flex-col gap-2 md:gap-0">
          {finishedGames.map((game) => (
            <div
              key={game.id}
              className="bg-card flex flex-col gap-4 overflow-hidden rounded-lg border p-4 md:flex-row md:rounded-none md:not-last:border-b-0 md:first:rounded-t-lg md:last:rounded-b-lg"
            >
              <div className="flex flex-[1_1_auto] gap-4 overflow-hidden">
                <div className="relative size-17 shrink-0 rounded">
                  <Image
                    alt={game.title}
                    src={game.cover?.secureUrl ?? "/placeholder.png"}
                    fill
                    className="h-full w-full rounded object-cover"
                  />
                </div>

                <div className="flex flex-col gap-1 overflow-hidden">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="truncate text-sm font-medium">
                      {game.title}
                    </div>
                    {game.edition && (
                      <Badge variant="secondary" className="shrink">
                        <span className="truncate">{game.edition}</span>
                      </Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {game.platform?.name}
                  </div>
                  <Stars activeStar={game.rating ? game.rating - 1 : null} />
                </div>
              </div>

              <div className="flex flex-row-reverse items-center justify-between gap-2 md:flex-col md:items-start">
                <Badge
                  variant="outline"
                  className="ml-auto cursor-default gap-1.5 pl-1.5 font-normal"
                >
                  <span className="size-2.5 flex-none rounded-full bg-green-400" />
                  Completed
                </Badge>
                <div className="text-muted-foreground text-xs">
                  Completed on {game.completedDate?.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="pb-4 text-xl font-medium tracking-tight">
          Recently added
        </h2>
        <div className="flex flex-col gap-2 md:gap-0">
          {addedGames.map((game) => (
            <div
              key={game.id}
              className="bg-card flex flex-col gap-4 overflow-hidden rounded-lg border p-4 md:flex-row md:rounded-none md:not-last:border-b-0 md:first:rounded-t-lg md:last:rounded-b-lg"
            >
              <div className="flex flex-[1_1_auto] gap-4 overflow-hidden">
                <div className="bg-muted relative size-17 shrink-0 rounded">
                  {game.cover?.secureUrl ? (
                    <Image
                      alt={game.title}
                      src={game.cover.secureUrl}
                      fill
                      className="h-full w-full rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="text-muted-foreground size-6" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 overflow-hidden">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="truncate text-sm font-medium">
                      {game.title}
                    </div>
                    {game.edition && (
                      <Badge variant="secondary" className="shrink">
                        <span className="truncate">{game.edition}</span>
                      </Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {game.platform?.name}
                  </div>
                  <Stars activeStar={game.rating ? game.rating - 1 : null} />
                </div>
              </div>

              <div className="flex min-w-25 shrink-0 gap-4 md:flex-col md:gap-2">
                <div className="flex items-center gap-2 truncate">
                  <ShoppingBag className="text-muted-foreground size-3" />
                  <span className="truncate font-mono text-xs">
                    {game.buyDate?.toLocaleDateString() ?? "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 truncate text-sm">
                  <Coins className="text-muted-foreground size-3" />
                  <span className="truncate font-mono text-xs">
                    {game.buyPrice ? priceFormatter.format(game.buyPrice) : "-"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
