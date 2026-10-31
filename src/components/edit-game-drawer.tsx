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
import { GameForm, gameFormSchema, type GameFormPayload } from "./game-form";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useUploadCover } from "@/utils/hooks/use-upload-cover";

interface Props {
  open: boolean;
  onClose: () => void;
  game?: Game;
}

export function EditGameDrawer({ open, onClose, game }: Props) {
  const [isDirty, setIsDirty] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const close = () => {
    setIsDirty(false);
    setConfirmOpen(false);
    onClose();
  };

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) return;
          // Dismissing (Esc, backdrop, close button) with edits asks first.
          if (isDirty) setConfirmOpen(true);
          else close();
        }}
      >
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
                  onSuccess={close}
                  onDirtyChange={setIsDirty}
                />
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogDescription>
              Your edits to {game?.title ?? "this game"} haven&apos;t been
              saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Keep editing
            </Button>
            <Button variant="destructive" onClick={close}>
              Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
      values: GameFormPayload;
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
  onDirtyChange,
}: {
  game: Game;
  onSuccess: () => void;
  onDirtyChange: (isDirty: boolean) => void;
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
      status: game.status,
      completedDate: game.completedDate ?? undefined,
      releaseDate: game.releaseDate ?? undefined,
      comment: game.comment ?? "",
      rating: game.rating ?? undefined,
    },
  });

  const { mutate, isPending } = useEditGameMutation(onSuccess);
  const { isDirty } = form.formState;

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  return (
    <GameForm
      form={form}
      onSubmit={(values) => mutate({ id: game.id, values })}
      isPending={isPending}
      defaultImageSrc={game.cover?.secureUrl}
      submitLabel="Save changes"
    />
  );
}
