"use client";

import { trpc } from "@/trpc/client";
import { useZodForm } from "@/utils/hooks/useZodForm";
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
  PlatformForm,
  platformFormSchema,
  type PlatformFormValues,
} from "./platform-form";

export function NewPlatformForm() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useZodForm({
    schema: platformFormSchema,
    defaultValues: {
      name: "",
      manufacturer: "",
    },
  });

  const { mutate, isPending, isSuccess } = trpc.platform.create.useMutation({
    onError: () => toast.error("Failed to create platform"),
    onSuccess: () => utils.platform.all.invalidate(),
  });

  const onSubmit = (values: PlatformFormValues) => {
    mutate({
      ...values,
      manufacturer: values.manufacturer || undefined,
    });
  };

  useEffect(() => {
    if (!isSuccess) return;
    toast.success("Platform created successfully");
    const redirectTimeout = setTimeout(() => router.push("/games"), 1000);
    return () => {
      clearTimeout(redirectTimeout);
    };
  }, [isSuccess, router]);

  return (
    <div className="flex flex-1 justify-center lg:flex-none">
      <Card className="w-full rounded-none py-8 ring-0 lg:max-w-2xl lg:rounded-xl lg:ring-1">
        <CardHeader className="px-8">
          <CardTitle className="text-2xl">New Platform</CardTitle>
          <CardDescription className="sr-only">
            Enter the details below to create a new platform
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8">
          <PlatformForm
            form={form}
            onSubmit={onSubmit}
            isPending={isPending}
            isSuccess={isSuccess}
            submitLabel="Add platform"
          />
        </CardContent>
      </Card>
    </div>
  );
}
