"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { Spinner } from "./ui/spinner";

export const platformFormSchema = z.object({
  name: z.string().min(1),
  manufacturer: z.string().optional(),
});

export type PlatformFormValues = z.infer<typeof platformFormSchema>;

interface Props {
  form: UseFormReturn<PlatformFormValues>;
  onSubmit: (values: PlatformFormValues) => void;
  isPending: boolean;
  isSuccess?: boolean;
  submitLabel: string;
}

export function PlatformForm({
  form,
  onSubmit,
  isPending,
  isSuccess,
  submitLabel,
}: Props) {
  const handleSubmit = form.handleSubmit((values) => onSubmit(values));

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="PlayStation 2"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="manufacturer"
          render={({ field, fieldState }) => (
            <Field>
              <Label htmlFor="manufacturer">
                Manufacturer{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="manufacturer"
                placeholder="Sony"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button
        type="submit"
        disabled={isPending || isSuccess}
        className="mt-5 w-full"
      >
        {isPending && <Spinner />}
        {submitLabel}
      </Button>
    </form>
  );
}
