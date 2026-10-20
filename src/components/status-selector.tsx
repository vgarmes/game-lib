"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusDot } from "./status-dot";
import { Status } from "@/types";
import { Badge } from "./ui/badge";
import { GAME_STATUSES, STATUS_LABELS } from "@/constants";

interface Props {
  status: Status[];
  onChange: (value: Status[]) => void;
}
export function StatusSelector({ status, onChange }: Props) {
  const handleToggleStatus = (toggledStatus: Status) => {
    const newStatus = status.includes(toggledStatus)
      ? status.filter((s) => s !== toggledStatus)
      : [...status, toggledStatus];
    onChange(newStatus);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="gap-2 font-normal">
            <div className="flex shrink-0 -space-x-1">
              {GAME_STATUSES.map((s) => (
                <StatusDot key={s} status={s} checked={status.includes(s)} />
              ))}
            </div>
            Status
            <Badge variant="secondary" className="h-5 min-h-5 tabular-nums">
              {status.length} / {GAME_STATUSES.length}
            </Badge>
          </Button>
        }
      />
      <DropdownMenuContent className="w-40">
        <DropdownMenuGroup>
          {GAME_STATUSES.map((s) => (
            <DropdownMenuCheckboxItem
              key={s}
              checked={status.includes(s)}
              onCheckedChange={() => {
                handleToggleStatus(s);
              }}
            >
              {STATUS_LABELS[s]}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
