import {
  FieldValues,
  useForm,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";

export function useZodForm<TInput extends FieldValues>(
  props: Omit<UseFormProps<TInput>, "resolver"> & {
    schema: z.ZodType<any, TInput>;
  },
) {
  const form = useForm<TInput>({
    ...props,
    resolver: zodResolver(props.schema, undefined, {
      // This makes it so we can use `.transform()`s on the schema without same transform getting applied again when it reaches the server

      raw: true,
    }),
  });

  return form;
}
