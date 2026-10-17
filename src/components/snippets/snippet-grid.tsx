import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

// Grid for snippet cards. The page owns the layout (columns and named
// grid-template-areas); each card picks its cell with `[grid-area:<name>]`.
export function SnippetGrid({ className, children }: Props) {
  return <div className={cn("grid gap-4", className)}>{children}</div>;
}
