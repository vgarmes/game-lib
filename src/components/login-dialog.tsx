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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";
import { useZodForm } from "@/utils/hooks/useZodForm";
import { useId, useState } from "react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schema = z.object({
  password: z.string().min(1, "Password is required"),
});

export function LoginDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const id = useId();
  const utils = trpc.useUtils();
  const form = useZodForm({
    schema,
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.password }),
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401 ? "Invalid password" : "Login failed",
        );
      }

      await utils.auth.me.invalidate();
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error("An error occurred while trying to log in", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full">Log in</Button>} />
      <DialogContent
        className="sm:max-w-sm"
        render={<form onSubmit={form.handleSubmit(onSubmit)} />}
      >
        <DialogHeader>
          <DialogTitle>Log in</DialogTitle>
          <DialogDescription>
            Enter your password to enable editing.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`password-${id}`}>Password</FieldLabel>
                <Input
                  {...field}
                  id={`password-${id}`}
                  type="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" disabled={isLoading}>
            Log in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
