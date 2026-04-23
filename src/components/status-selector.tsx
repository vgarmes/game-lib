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
import { GAME_STATUSES } from "@/constants";

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
            <div className="w-5 shrink-0">
              <StatusDot
                status="completed"
                checked={status.includes("completed")}
                style={{ left: 0 }}
              />
              <StatusDot
                status="backlog"
                checked={status.includes("backlog")}
                style={{ left: -4 }}
              />
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
          <DropdownMenuCheckboxItem
            checked={status.includes("completed")}
            onCheckedChange={() => {
              handleToggleStatus("completed");
            }}
          >
            Completed
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={status.includes("backlog")}
            onCheckedChange={() => {
              handleToggleStatus("backlog");
            }}
          >
            Backlog
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
