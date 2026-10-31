import { ImageOff } from "lucide-react";

/** Fills its (sized, relative) parent when a game has no cover. */
export function CoverFallback({ title }: { title: string }) {
  return (
    <div
      role="img"
      aria-label={`${title} (no cover)`}
      className="bg-muted text-muted-foreground absolute inset-0 flex items-center justify-center rounded"
    >
      <ImageOff className="size-4" aria-hidden="true" />
    </div>
  );
}
