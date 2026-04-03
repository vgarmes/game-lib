"use client";

import { Game } from "@/types/trpc";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import Image from "next/image";
import { Stars } from "./common";
import { useIsAdmin } from "@/utils/hooks/use-is-admin";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Editable, EditableInput, EditablePreview } from "./common/editable";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { ImageOff } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game?: Game;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
});

const DEFAULT_VALUES = {
  title: "",
  inCollection: false,
  completed: false,
  edition: "",
  releaseDate: undefined,
  completedDate: undefined,
  buyDate: undefined,
  buyPrice: undefined,
  developerId: undefined,
  rating: undefined,
  comment: "",
  platformId: undefined,
  coverId: undefined,
};

export function GameSheet({ open, onOpenChange, game }: Props) {
  const isAdmin = useIsAdmin();

  const { mutate, isPending } = trpc.game.update.useMutation({
    onSuccess() {
      toast("Game updated successfully!");
    },
    onError() {
      toast.error("Ups! Something went wrong.", {
        description: "There was a problem with your request.",
      });
    },
  });
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="data-[side=right]:w-full">
        <SheetHeader className="h-12">
          <SheetTitle className="sr-only">{game?.title}</SheetTitle>
          <SheetDescription className="sr-only">
            See the game details
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 px-4">
          {game && (
            <div className="flex flex-col gap-6">
              {game.cover ? (
                <Image
                  alt={game.title}
                  width={game.cover.width}
                  height={game.cover.height}
                  src={game.cover.secureUrl}
                  className="relative h-full max-h-36 w-auto self-start rounded object-contain"
                />
              ) : (
                <div className="bg-card flex size-36 items-center justify-center rounded border">
                  <ImageOff />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Editable
                  value={game.title}
                  onChange={(newValue) =>
                    newValue !== game.title &&
                    mutate({
                      id: game.id,
                      title: newValue,
                    })
                  }
                  disabled={!isAdmin}
                >
                  <EditableInput />
                  <EditablePreview className="flex h-8 items-center text-lg leading-tight font-medium" />
                </Editable>

                {game.edition && <p>{game.edition}</p>}
                <h2 className="text-muted-foreground font-medium">
                  {game.platform?.name}
                </h2>
                <Stars activeStar={game.rating ? game.rating - 1 : 0} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-muted-foreground text-sm">
                  Date finished
                </div>
                <div className="text-sm">
                  {game.completedDate &&
                    dateFormatter.format(game.completedDate)}
                </div>
                <div className="text-muted-foreground text-sm">
                  In collection
                </div>
                <div className="text-sm">
                  {game.inCollection ? "Yes" : "No"}
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
