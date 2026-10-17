import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface Props {
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

// Shared shell for the small dashboard-style cards ("snippets").
export function SnippetCard({ title, action, className, children }: Props) {
  return (
    <Card className={cn("h-full gap-4 p-4", className)}>
      <div className="flex min-h-6 items-center justify-between gap-2">
        <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </Card>
  );
}
