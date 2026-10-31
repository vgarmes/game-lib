"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dateToUtcWithoutTime } from "@/utils";
import { Controller, UseFormReturn } from "react-hook-form";
import { ImageField } from "./image-upload";
import { PlatformSelector } from "./platform-selector";
import * as z from "zod";
import { Spinner } from "./ui/spinner";
import { Switch } from "./ui/switch";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { DatePicker } from "./ui/date-picker";
import { Textarea } from "./ui/textarea";
import { StarsInput } from "./stars";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { StatusDot } from "./status-dot";
import { GAME_STATUSES, STATUS_LABELS } from "@/constants";
import { Status } from "@/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const EASE_OUT = "ease-[cubic-bezier(0.23,1,0.32,1)]";

/**
 * Conditional sub-section (e.g. buy date/price under "Owned") that grows
 * open instead of shoving the rest of the form down in one frame.
 * Padding lives on the inner div so the panel itself can reach height 0.
 */
function RevealPanel({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <Collapsible open={open}>
      <CollapsibleContent
        className={cn(
          "h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-200",
          EASE_OUT,
          "data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0",
          // Reduced motion: keep the fade, drop the height change.
          "motion-reduce:transition-opacity",
        )}
      >
        <div className="flex flex-col items-start gap-5 border-t px-3 py-5 md:flex-row">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function SubmitIcon({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "absolute inset-0 flex items-center justify-center transition-[opacity,scale,filter] duration-200",
        EASE_OUT,
        !visible && "opacity-0 motion-safe:scale-50 motion-safe:blur-[2px]",
      )}
    >
      {children}
    </span>
  );
}

export const gameFormSchema = z.object({
  title: z.string().min(1),
  platformId: z.number({ error: "You need to select a platform" }),
  cover: z.file().optional(),
  inCollection: z.boolean(),
  status: z.enum(GAME_STATUSES),
  edition: z.string().optional(),
  releaseDate: z.date().optional(),
  completedDate: z.date().optional(),
  buyDate: z.date().optional(),
  buyPrice: z.number().nonnegative().optional(),
  rating: z.number().optional(),
  comment: z.string().optional(),
});

export type GameFormValues = z.infer<typeof gameFormSchema>;

interface Props {
  form: UseFormReturn<GameFormValues>;
  onSubmit: (values: GameFormValues) => void;
  isPending: boolean;
  isSuccess?: boolean;
  submitLabel: string;
  /** Existing cover url shown as a preview when editing. */
  defaultImageSrc?: string;
}

export function GameForm({
  form,
  onSubmit,
  isPending,
  isSuccess,
  submitLabel,
  defaultImageSrc,
}: Props) {
  const handleSubmit = form.handleSubmit((values) => {
    const { completedDate, buyDate, releaseDate } = values;
    onSubmit({
      ...values,
      completedDate: completedDate
        ? dateToUtcWithoutTime(completedDate)
        : completedDate,
      buyDate: buyDate ? dateToUtcWithoutTime(buyDate) : buyDate,
      releaseDate: releaseDate
        ? dateToUtcWithoutTime(releaseDate)
        : releaseDate,
    });
  });

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="cover"
          render={({ field }) => (
            <ImageField
              defaultImageSrc={defaultImageSrc}
              file={field.value}
              onFileChange={field.onChange}
            />
          )}
        />

        <Controller
          control={form.control}
          name="rating"
          render={({ field }) => (
            <Field>
              <Label>
                Rating{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <StarsInput
                value={field.value ?? null}
                onChange={field.onChange}
              />
            </Field>
          )}
        />

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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="edition"
          render={({ field, fieldState }) => (
            <Field>
              <Label htmlFor="edition">
                Edition{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="edition"
                placeholder="Deluxe Edition"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="platformId"
          render={({ field, fieldState }) => (
            <Field>
              <Label htmlFor="platform">Platform</Label>
              <PlatformSelector
                selectedId={field.value}
                onSelect={field.onChange}
                isInvalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="inCollection"
          render={({ field }) => (
            <div className="border-input flex flex-col rounded-sm border">
              <FieldLabel
                htmlFor="switch-in-collection"
                className="border-none"
              >
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Owned</FieldTitle>
                    <FieldDescription>
                      This game is currently in my collection.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="switch-in-collection"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              </FieldLabel>
              <RevealPanel open={field.value}>
                <Controller
                  control={form.control}
                  name="buyDate"
                  render={({ field }) => (
                    <Field>
                      <Label htmlFor="buy-date">
                        Buy date{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </Label>
                      <DatePicker
                        id="buy-date"
                        date={field.value}
                        onDateChange={field.onChange}
                      />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="buyPrice"
                  render={({ field, fieldState }) => (
                    <Field>
                      <Label htmlFor="buy-price">
                        Price{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="buy-price"
                          type="number"
                          className="pr-14"
                          aria-invalid={fieldState.invalid}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const numberValue = Number(e.target.value);
                            field.onChange(
                              isNaN(numberValue) || e.target.value === ""
                                ? null
                                : numberValue,
                            );
                          }}
                        />
                        <div className="border-input text-muted-foreground absolute top-px right-px bottom-px flex w-12 items-center justify-center border-l">
                          EUR
                        </div>
                      </div>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </RevealPanel>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <div className="border-input flex flex-col rounded-sm border">
              <Field orientation="horizontal" className="p-3">
                <FieldContent>
                  <FieldTitle>Status</FieldTitle>
                  <FieldDescription>
                    Where you are with this game.
                  </FieldDescription>
                </FieldContent>
                <Select
                  value={field.value}
                  onValueChange={(value) => value && field.onChange(value)}
                >
                  <SelectTrigger id="select-status" className="w-36">
                    <SelectValue>
                      {(value: Status) => (
                        <>
                          <StatusDot status={value} />
                          {STATUS_LABELS[value]}
                        </>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {GAME_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        <span className="flex items-center gap-2">
                          <StatusDot status={status} />
                          {STATUS_LABELS[status]}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <RevealPanel open={field.value === "completed"}>
                <Controller
                  control={form.control}
                  name="completedDate"
                  render={({ field }) => (
                    <Field>
                      <Label htmlFor="completed-date">
                        Completion date{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </Label>
                      <DatePicker
                        id="completed-date"
                        date={field.value}
                        onDateChange={field.onChange}
                      />
                    </Field>
                  )}
                />
              </RevealPanel>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="releaseDate"
          render={({ field }) => (
            <Field>
              <Label htmlFor="release-date">
                Release date{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <DatePicker
                id="release-date"
                date={field.value}
                onDateChange={field.onChange}
              />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="comment"
          render={({ field }) => (
            <Field>
              <Label htmlFor="comment">
                Comment{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Textarea id="comment" {...field} />
            </Field>
          )}
        />
      </FieldGroup>
      <Button
        type="submit"
        disabled={isPending || isSuccess}
        // Keep the "Saved" state at full strength instead of the faded
        // disabled look while we wait for the redirect.
        className={cn("mt-5 w-full", isSuccess && "disabled:opacity-100")}
      >
        {(isPending || isSuccess) && (
          // Both icons share one slot so pending -> success cross-fades in
          // place instead of swapping.
          <span className="relative size-5">
            <SubmitIcon visible={!isSuccess}>
              <Spinner color="currentColor" />
            </SubmitIcon>
            <SubmitIcon visible={!!isSuccess}>
              <Check />
            </SubmitIcon>
          </span>
        )}
        {isSuccess ? "Saved" : submitLabel}
      </Button>
    </form>
  );
}
