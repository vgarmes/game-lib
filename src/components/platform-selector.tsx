import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { trpc } from "@/trpc/client";

interface Props {
  onSelect: (id: number | undefined) => void;
  selectedId: number | undefined;
  className?: string;
  placeholder?: string;
}

export function PlatformSelector({
  onSelect,
  selectedId,
  className,
  placeholder,
}: Props) {
  const { data: options = [] } = trpc.platform.all.useQuery(undefined, {
    staleTime: Infinity,
  });
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-[200px] justify-between", className)}
          >
            {selectedId ? (
              options.find((platform) => platform.id === selectedId)?.name
            ) : (
              <span className="text-muted-foreground font-normal">
                {placeholder ?? "Select platform..."}
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search platform..." />
          <CommandList>
            <CommandEmpty>No platform found.</CommandEmpty>
            <CommandGroup>
              {options.map((platform) => (
                <CommandItem
                  key={platform.id}
                  value={platform.name}
                  onSelect={() => {
                    onSelect(platform.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedId === platform.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {platform.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
