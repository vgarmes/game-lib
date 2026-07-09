"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useMemo, useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "./drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  id?: string;
  date: Date | undefined;
  onDateChange: (value: Date | undefined) => void;
  /**
   * Render as a popover even on mobile. Use when the picker lives inside
   * another overlay (e.g. a Sheet), where a nested drawer stacks incorrectly.
   */
  disableMobileDrawer?: boolean;
}

export function DatePicker({
  id,
  date,
  onDateChange,
  disableMobileDrawer,
}: Props) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const trigger = (
    <Button variant="outline" id={id} className="justify-start font-normal">
      {date ? format(date, "PPP") : <span>Pick a date</span>}
    </Button>
  );

  if (isMobile && !disableMobileDrawer) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger render={trigger} />
        <DrawerContent className="min-h-80">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(value) => {
              onDateChange(value);
              setOpen(false);
            }}
            defaultMonth={date}
            className="w-full p-0"
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={trigger} />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(value) => {
            onDateChange(value);
            setOpen(false);
          }}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  );
}
