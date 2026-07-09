"use client";

import { Game } from "@/types/trpc";
import { trpc } from "@/trpc/client";
import { useZodForm } from "@/utils/hooks/useZodForm";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { GameForm, gameFormSchema, type GameFormValues } from "./game-form";
import { useUploadCover } from "@/utils/hooks/use-upload-cover";

interface Props {
  open: boolean;
  onClose: () => void;
  game?: Game;
}

export function EditGameDrawer({ open, onClose, game }: Props) {
  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
        <SheetHeader className="border-b">
          <SheetTitle>Edit game</SheetTitle>
          <SheetDescription>
            Update the details for {game?.title ?? "this game"}.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="min-h-0 flex-1">
          <div className="px-4 pb-8">
            {game && (
              // Re-mount the form per game so its default values reset.
              <EditGameFormContent
                key={game.id}
                game={game}
                onSuccess={onClose}
              />
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function useEditGameMutation(onSuccess: () => void) {
  const uploadCover = useUploadCover();
  const updateGame = trpc.game.update.useMutation();

  return useMutation({
    onError: () => toast.error("Failed to update game"),
    onSuccess: () => {
      toast.success("Game updated successfully");
      onSuccess();
    },
    mutationFn: async ({
      id,
      values,
    }: {
      id: number;
      values: GameFormValues;
    }) => {
      const { cover, ...rest } = values;
      // Only upload when the admin picked a new file; otherwise keep the
      // existing cover untouched (coverId omitted leaves it unchanged).
      const coverId = cover ? await uploadCover(cover) : undefined;

      await updateGame.mutateAsync({
        id,
        ...rest,
        coverId,
      });
    },
  });
}

function EditGameFormContent({
  game,
  onSuccess,
}: {
  game: Game;
  onSuccess: () => void;
}) {
  const form = useZodForm({
    schema: gameFormSchema,
    defaultValues: {
      cover: undefined,
      title: game.title,
      edition: game.edition ?? "",
      platformId: game.platformId ?? undefined,
      inCollection: game.inCollection ?? false,
      buyDate: game.buyDate ?? undefined,
      buyPrice: game.buyPrice ?? undefined,
      completed: game.completed ?? false,
      completedDate: game.completedDate ?? undefined,
      releaseDate: game.releaseDate ?? undefined,
      comment: game.comment ?? "",
      rating: game.rating ?? undefined,
    },
  });

  const { mutate, isPending } = useEditGameMutation(onSuccess);

  return (
    <GameForm
      form={form}
      onSubmit={(values) => mutate({ id: game.id, values })}
      isPending={isPending}
      defaultImageSrc={game.cover?.secureUrl}
      submitLabel="Save changes"
      disableMobileDatePicker
    />
  );
}
