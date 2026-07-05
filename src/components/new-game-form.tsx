"use client";

import { trpc } from "@/trpc/client";
import { useZodForm } from "@/utils/hooks/useZodForm";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  GameForm,
  gameFormSchema,
  type GameFormValues,
} from "./game-form";
import { useUploadCover } from "@/utils/hooks/use-upload-cover";

function useNewGameMutation() {
  const uploadCover = useUploadCover();
  const createGame = trpc.game.create.useMutation();

  return useMutation({
    onError: () => toast.error("Failed to create game"),
    mutationFn: async (formValues: GameFormValues) => {
      const { cover, ...rest } = formValues;
      const coverId = cover ? await uploadCover(cover) : undefined;

      await createGame.mutateAsync({
        ...rest,
        coverId,
      });
    },
  });
}

export function NewGameForm() {
  const router = useRouter();

  const form = useZodForm({
    schema: gameFormSchema,
    defaultValues: {
      cover: undefined,
      title: "",
      edition: "",
      platformId: undefined,
      inCollection: true,
      buyDate: undefined,
      buyPrice: undefined,
      completed: false,
      completedDate: undefined,
      releaseDate: undefined,
      comment: "",
      rating: undefined,
    },
  });

  const { mutate, isPending, isSuccess } = useNewGameMutation();

  useEffect(() => {
    if (!isSuccess) return;
    toast.success("Game created successfully");
    const redirectTimeout = setTimeout(() => router.push("/games"), 1000);
    return () => {
      clearTimeout(redirectTimeout);
    };
  }, [isSuccess, router]);

  return (
    <div className="flex flex-1 justify-center lg:flex-none">
      <Card className="w-full rounded-none py-8 ring-0 lg:max-w-2xl lg:rounded-xl lg:ring-1">
        <CardHeader className="px-8">
          <CardTitle className="text-2xl">New Game</CardTitle>
          <CardDescription className="sr-only">
            Enter the details below to create a new game
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8">
          <GameForm
            form={form}
            onSubmit={mutate}
            isPending={isPending}
            isSuccess={isSuccess}
            submitLabel="Add game"
          />
        </CardContent>
      </Card>
    </div>
  );
}
