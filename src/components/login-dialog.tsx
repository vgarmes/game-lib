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
import { useZodForm } from "@/utils/hooks/useZodForm";
import { signIn } from "next-auth/react";
import { useId, useState } from "react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schema = z.object({
  email: z.email("Not a valid email"),
  password: z.string(),
});

export function LoginDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const id = useId();
  const form = useZodForm({
    schema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);

    try {
      const response = await signIn<"credentials">("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!response?.ok) {
        throw new Error(response?.error ?? "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred while trying to log in", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger render={<Button className="w-full">Log in</Button>} />
      <DialogContent
        className="sm:max-w-sm"
        render={<form onSubmit={form.handleSubmit(onSubmit)} />}
      >
        <DialogHeader>
          <DialogTitle>Log in</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`email-${id}`}>Email</FieldLabel>
                <Input
                  {...field}
                  id={`email-${id}`}
                  aria-invalid={fieldState.invalid}
                  placeholder="Email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
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
          <Button type="submit">Log in</Button>
        </DialogFooter>{" "}
      </DialogContent>
    </Dialog>
  );
}
