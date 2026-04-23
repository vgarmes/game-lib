import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ComponentProps } from "react";

interface Props extends ComponentProps<"span"> {
  status: "completed" | "backlog";
  checked?: boolean;
}

const variants = cva(
  "ease inline-block h-2.5 w-2.5 rounded-[5px] bg-green-500 ring ring-background transition-colors duration-200",
  {
    variants: {
      status: {
        completed: "bg-green-400",
        backlog: "bg-neutral-400",
      },
    },
  },
);

export function StatusDot({
  status,
  className,
  checked = true,
  ...props
}: Props) {
  return (
    <span
      className={cn(
        variants({ status }),
        {
          "bg-background shadow-[inset_0_0_0_1px] shadow-neutral-200 dark:shadow-neutral-600":
            !checked,
        },
        className,
      )}
      {...props}
    />
  );
}
