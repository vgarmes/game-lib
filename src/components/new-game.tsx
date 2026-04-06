import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import schema, { GameSchema } from "@/server/routers/game/schema";
import { trpc } from "@/trpc/client";
import { dateToUtcWithoutTime } from "@/utils";
import { useZodForm } from "@/utils/hooks/useZodForm";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

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

export function NewGame() {
  const [open, setOpen] = useState(false);
  const form = useZodForm({
    schema,
    defaultValues: DEFAULT_VALUES,
  });

  const { mutate, isPending, isSuccess } = trpc.game.create.useMutation();

  const onSubmit = (values: GameSchema) => {
    const { completedDate, buyDate, releaseDate } = values;
    const newValues = {
      ...values,
      completedDate: completedDate
        ? dateToUtcWithoutTime(completedDate)
        : completedDate,
      buyDate: buyDate ? dateToUtcWithoutTime(buyDate) : buyDate,
      releaseDate: releaseDate
        ? dateToUtcWithoutTime(releaseDate)
        : releaseDate,
    };
    mutate(newValues);
  };

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      setOpen(false);
    }
  }, [isSuccess]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <Plus />
            New game
          </Button>
        }
      />
      <DialogContent
        className="sm:max-w-sm"
        render={<form onSubmit={form.handleSubmit(onSubmit)} />}
      >
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field>
                <Label htmlFor="title">Name</Label>
                <Input
                  id="title"
                  placeholder="Metal Gear Solid"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" disabled={isPending}>
                Cancel
              </Button>
            }
          />
          <Button type="submit" disabled={isPending}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
