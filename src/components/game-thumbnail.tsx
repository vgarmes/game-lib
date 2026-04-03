import Image from "next/image";
import { Stars } from "./common";
import { Game } from "@/types/trpc";
import { ImageOff, Shapes } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface Props {
  game: Game;
}
export function GameThumbnail({ game }: Props) {
  const { title, cover, rating } = game;
  return (
    <div className="bg-card relative flex w-45 shrink-0 flex-col items-center gap-1 overflow-hidden rounded-lg border p-3">
      {cover ? (
        <>
          <Image
            alt={title}
            src={cover?.secureUrl}
            fill={true}
            className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur"
          />

          <Image
            alt={title}
            width={cover.width}
            height={cover.height}
            src={cover?.secureUrl}
            className="relative h-full max-h-36 w-auto rounded object-contain"
          />
        </>
      ) : (
        <div className="flex h-36 w-36 items-center justify-center">
          <ImageOff className="text-muted-foreground" />
        </div>
      )}
      <div className="flex w-full flex-1 flex-col items-start justify-end gap-1">
        <h1 className="line-clamp-2 w-full pt-2 text-left text-sm tracking-tight">
          {title}
        </h1>
        <div className="flex w-full items-center justify-between">
          {rating && <Stars activeStar={rating - 1} />}
          {game.edition && (
            <Tooltip>
              <TooltipTrigger render={<Shapes className="size-4" />} />
              <TooltipContent>
                <p>{game.edition}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}
