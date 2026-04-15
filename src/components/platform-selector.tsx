import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useState } from "react";
import {
  Drawer,
  DrawerBackdrop,
  DrawerPortal,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { ChevronDown, X } from "lucide-react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { Drawer as DrawerPrimitive } from "@base-ui/react";

interface Props {
  onSelect: (id: number | null) => void;
  selectedId: number | null;
  className?: string;
  placeholder?: string;
  isInvalid?: boolean;
}

function select(
  data: {
    id: number;
    name: string;
    manufacturer: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[],
) {
  return data
    .map((platform) => ({
      value: platform.id,
      label: platform.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
export function PlatformSelector({
  onSelect,
  selectedId,
  className,
  placeholder = "Select a platform",
  isInvalid,
}: Props) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { data: items = [] } = trpc.platform.all.useQuery(undefined, {
    staleTime: Infinity,
    select,
  });

  const selectedItem = items.find((item) => item.value === selectedId) ?? null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <div className="relative">
          <DrawerTrigger
            render={
              <Button
                variant="outline"
                className={cn(
                  "hover:bg-background-100 dark:hover:bg-background-100 w-full justify-between text-base font-normal md:text-sm",
                  {
                    "dark:text-muted-foreground text-muted-foreground":
                      !selectedItem,
                  },
                )}
              >
                {selectedItem?.label ?? "All platforms"}
                {!selectedItem && <ChevronDown />}
              </Button>
            }
          />
          {selectedItem && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-1/2 right-1 -translate-y-1/2"
              onClick={() => {
                onSelect(null);
              }}
            >
              <X />
            </Button>
          )}
        </div>
        <DrawerPortal data-slot="drawer-portal">
          <DrawerBackdrop />
          <DrawerPrimitive.Viewport className="fixed inset-0 flex items-end justify-center">
            <DrawerPrimitive.Popup
              data-slot="drawer-popup"
              className="bg-background-100 -mb-12 h-[calc(80vh+3rem)] w-full transform-[translateY(var(--drawer-swipe-movement-y))] touch-auto overflow-y-auto overscroll-contain rounded-t-md border-t pb-[calc(1.5rem+env(safe-area-inset-bottom,0px)+3rem)] transition-transform duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:transform-[translateY(calc(100%-3rem+2px))] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:transform-[translateY(calc(100%-3rem+2px))] data-swiping:select-none"
            >
              <DrawerPrimitive.Content
                data-slot="drawer-content"
                className={cn("mx-auto w-full", className)}
              >
                <Combobox
                  items={items}
                  value={selectedItem}
                  onValueChange={(value) => {
                    onSelect(value?.value ?? null);
                    if (value !== null) {
                      setOpen(false);
                    }
                  }}
                  inputValue={inputValue}
                  open={open}
                >
                  <ComboboxPrimitive.Input
                    className="bg-background-100 sticky top-0 z-10 h-12 w-full rounded-none border-0 border-b px-4 font-normal focus-visible:outline-none"
                    placeholder="Search..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  <div className="flex-flex-col py-2">
                    <ComboboxPrimitive.Empty className="text-muted-foreground px-4 text-sm">
                      No results
                    </ComboboxPrimitive.Empty>

                    <ComboboxList className="flex-1 overscroll-auto px-2 py-0">
                      {(option: (typeof items)[number]) => (
                        <ComboboxItem
                          key={option.value}
                          value={option}
                          className="text-md min-h-9"
                        >
                          {option.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </div>
                </Combobox>
              </DrawerPrimitive.Content>
            </DrawerPrimitive.Popup>
          </DrawerPrimitive.Viewport>
        </DrawerPortal>
      </Drawer>
    );
  }

  return (
    <Combobox
      items={items}
      value={selectedItem}
      onValueChange={(value) => {
        onSelect(value?.value ?? null);
      }}
    >
      <ComboboxInput
        className={cn("h-10", className)}
        placeholder={placeholder}
        showClear={true}
        aria-invalid={isInvalid}
      />
      <ComboboxContent>
        <ComboboxEmpty>No platforms found.</ComboboxEmpty>
        <ComboboxList>
          {(option: (typeof items)[number]) => (
            <ComboboxItem key={option.value} value={option}>
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
