"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsAuthed } from "@/utils/hooks/use-is-authed";
import { ChevronDown, Gamepad, Plus } from "lucide-react";
import Link from "next/link";

export function AddGameButton() {
  const isAuthed = useIsAuthed();

  if (!isAuthed) return null;

  return (
    <ButtonGroup>
      <Button nativeButton={false} render={<Link href="/games/new" />}>
        <Plus />
        Add game
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              size="icon"
              className="hover:bg-primary/80 size-10 cursor-pointer"
              aria-label="More options"
            >
              <ChevronDown />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="min-w-[200px]">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="h-8 gap-2"
              render={<Link href="/platforms/new" />}
            >
              <Gamepad className="size-5" />
              Add platform
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
