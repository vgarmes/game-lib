"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { DatePicker } from "./ui/date-picker";
import { Textarea } from "./ui/textarea";
import { StarsInput } from "./stars";
import { StatusDot } from "./status-dot";
import { GAME_STATUSES, STATUS_LABELS } from "@/constants";
import { Status } from "@/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const EASE_OUT = "ease-[cubic-bezier(0.23,1,0.32,1)]";

/** Left-to-right order reads as progress: not started → playing → done. */
const STATUS_ORDER: Status[] = ["backlog", "in_progress", "completed"];

/**
 * Conditional sub-section (e.g. buy date/price under "Owned") that grows
 * open instead of shoving the rest of the form down in one frame.
 * Kept mounted (hidden when closed) so the controlling input's
 * `aria-controls` always points at a real element.
 * Padding lives on the inner div so the panel itself can reach height 0.
 */
function RevealPanel({
  id,
  open,
  children,
}: {
  id: string;
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <Collapsible open={open}>
      <CollapsibleContent
        id={id}
        keepMounted
        className={cn(
          "h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-200",
          EASE_OUT,
          "data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0",
          // Reduced motion: keep the fade, drop the height change.
          "motion-reduce:transition-opacity",
        )}
      >
        {/* Container query, not viewport: the form also lives in a narrow drawer. */}
        <div className="flex flex-col gap-5 border-t px-2.5 py-5 @md:flex-row @md:*:flex-1">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

const STATUS_DESCRIPTIONS: Record<Status, string> = {
  backlog: "Haven't started it yet.",
  in_progress: "Currently playing it.",
  completed: "Finished it.",
};

/**
 * shadcn choice card (FieldLabel wrapping a horizontal Field). With a
 * `panel`, the card becomes a wrapper so the revealed fields sit inside it
 * without nesting them in the <label> (nested labels, and the panel text
 * would leak into the control's accessible name). Same look either way.
 */
function ChoiceCard({
  htmlFor,
  panel,
  children,
}: {
  htmlFor: string;
  panel?: React.ReactNode;
  children: React.ReactNode;
}) {
  if (!panel) return <FieldLabel htmlFor={htmlFor}>{children}</FieldLabel>;
  return (
    <div
      className={cn(
        "border-input rounded-sm border transition-[background-color,border-color]",
        "has-data-checked:border-primary/30 has-data-checked:bg-primary/5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10",
        "has-[>label:hover]:bg-muted/50",
        "has-[>label_:focus-visible]:border-ring has-[>label_:focus-visible]:ring-ring/50 has-[>label_:focus-visible]:ring-3",
      )}
    >
      <Label
        htmlFor={htmlFor}
        className="group/field-label flex w-full flex-col items-stretch *:data-[slot=field]:p-2.5"
      >
        {children}
      </Label>
      {panel}
    </div>
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

function RequiredHint() {
  return <span className="text-muted-foreground font-normal">(required)</span>;
}

export const gameFormSchema = z.object({
  title: z.string().trim().min(1, "Enter a name"),
  platformId: z.number({ error: "Select a platform" }),
  cover: z.file().optional(),
  inCollection: z.boolean(),
  status: z.enum(GAME_STATUSES),
  edition: z.string().optional(),
  releaseDate: z.date().optional(),
  completedDate: z.date().optional(),
  buyDate: z.date().optional(),
  // Clearing the input yields null, so null must validate.
  buyPrice: z.number().nonnegative("Price can't be negative").nullish(),
  rating: z.number().optional(),
  comment: z.string().optional(),
});

export type GameFormValues = z.infer<typeof gameFormSchema>;

/**
 * What the form submits. Fields hidden by their controlling choice are sent
 * as `null` so the server clears them instead of keeping stale values.
 */
export type GameFormPayload = Omit<
  GameFormValues,
  "releaseDate" | "completedDate" | "buyDate" | "buyPrice"
> & {
  releaseDate: Date | null;
  completedDate: Date | null;
  buyDate: Date | null;
  buyPrice: number | null;
};

function toDateOnly(date: Date | undefined) {
  return date ? dateToUtcWithoutTime(date) : null;
}

function toPayload(values: GameFormValues): GameFormPayload {
  const owned = values.inCollection;
  const completed = values.status === "completed";
  return {
    ...values,
    releaseDate: toDateOnly(values.releaseDate),
    buyDate: owned ? toDateOnly(values.buyDate) : null,
    buyPrice: owned ? (values.buyPrice ?? null) : null,
    completedDate: completed ? toDateOnly(values.completedDate) : null,
  };
}

interface Props {
  form: UseFormReturn<GameFormValues>;
  onSubmit: (values: GameFormPayload) => void;
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
  // Hidden values stay in form state (toggling back restores them) and are
  // only dropped from what gets saved.
  const handleSubmit = form.handleSubmit((values) =>
    onSubmit(toPayload(values)),
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
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
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label htmlFor="title">
                Name <RequiredHint />
              </Label>
              <Input
                id="title"
                placeholder="e.g. Metal Gear Solid…"
                autoComplete="off"
                aria-required
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
            <Field data-invalid={fieldState.invalid}>
              <Label htmlFor="edition">Edition</Label>
              <Input
                id="edition"
                placeholder="e.g. Deluxe Edition…"
                autoComplete="off"
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
            <Field data-invalid={fieldState.invalid}>
              <Label htmlFor="platform">
                Platform <RequiredHint />
              </Label>
              <PlatformSelector
                id="platform"
                ref={field.ref}
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
          name="releaseDate"
          render={({ field }) => (
            <Field>
              <Label htmlFor="release-date">Release date</Label>
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
          name="inCollection"
          render={({ field }) => (
            <ChoiceCard
              htmlFor="switch-in-collection"
              panel={
                <RevealPanel id="purchase-details" open={field.value}>
                  <Controller
                    control={form.control}
                    name="buyDate"
                    render={({ field }) => (
                      <Field>
                        <Label htmlFor="buy-date">Buy date</Label>
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
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="buy-price">Price</Label>
                        <div className="relative">
                          <Input
                            id="buy-price"
                            ref={field.ref}
                            name={field.name}
                            onBlur={field.onBlur}
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min={0}
                            placeholder="59.99"
                            className="pr-14"
                            aria-describedby="buy-price-currency"
                            aria-invalid={fieldState.invalid}
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const numberValue = e.target.valueAsNumber;
                              field.onChange(
                                Number.isNaN(numberValue) ? null : numberValue,
                              );
                            }}
                          />
                          <div
                            id="buy-price-currency"
                            className="border-input text-muted-foreground absolute top-px right-px bottom-px flex w-12 items-center justify-center border-l"
                          >
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
              }
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
                  aria-controls="purchase-details"
                />
              </Field>
            </ChoiceCard>
          )}
        />

        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <FieldSet className="gap-3">
              <div className="flex flex-col gap-0.5">
                <FieldLegend variant="label" className="mb-0">
                  Status
                </FieldLegend>
                <FieldDescription>
                  Where you are with this game.
                </FieldDescription>
              </div>
              <RadioGroup
                value={field.value}
                onValueChange={(value) => {
                  const status = value as Status;
                  field.onChange(status);
                  // Most games are marked completed the day they're
                  // finished; prefill it, the picker stays editable.
                  if (
                    status === "completed" &&
                    !form.getValues("completedDate")
                  ) {
                    form.setValue("completedDate", new Date(), {
                      shouldDirty: true,
                    });
                  }
                }}
              >
                {STATUS_ORDER.map((status) => (
                  <ChoiceCard
                    key={status}
                    htmlFor={`status-${status}`}
                    panel={
                      status === "completed" && (
                        <RevealPanel
                          id="completion-details"
                          open={field.value === "completed"}
                        >
                          <Controller
                            control={form.control}
                            name="completedDate"
                            render={({ field }) => (
                              <Field>
                                <Label htmlFor="completed-date">
                                  Completion date
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
                      )
                    }
                  >
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>
                          <StatusDot status={status} />
                          {STATUS_LABELS[status]}
                        </FieldTitle>
                        <FieldDescription>
                          {STATUS_DESCRIPTIONS[status]}
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        id={`status-${status}`}
                        value={status}
                        aria-controls={
                          status === "completed"
                            ? "completion-details"
                            : undefined
                        }
                      />
                    </Field>
                  </ChoiceCard>
                ))}
              </RadioGroup>
            </FieldSet>
          )}
        />

        <Controller
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FieldSet className="gap-2">
              <FieldLegend id="rating-label" variant="label" className="mb-0">
                Rating
              </FieldLegend>
              <StarsInput
                aria-labelledby="rating-label"
                value={field.value ?? null}
                onChange={field.onChange}
              />
            </FieldSet>
          )}
        />

        <Controller
          control={form.control}
          name="comment"
          render={({ field }) => (
            <Field>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Thoughts, where you left off…"
                {...field}
              />
            </Field>
          )}
        />
      </FieldGroup>
      <Button
        type="submit"
        disabled={isPending || isSuccess}
        // Keep the "Saved" state at full strength instead of the faded
        // disabled look while we wait for the redirect.
        className={cn("mt-8 w-full", isSuccess && "disabled:opacity-100")}
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
