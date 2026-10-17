import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

// Responsive bento grid for snippet cards. Children can span cells with
// `md:col-span-2` / `md:row-span-2` to build up a layout as more cards land.
export function SnippetGrid({ className, children }: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
