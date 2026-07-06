"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { trpc } from "@/trpc/client";
import { MoreVertical, CircleUser, LogOut } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import { LoginDialog } from "./login-dialog";

export function NavUser() {
  const { data } = trpc.auth.me.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });
  const utils = trpc.useUtils();
  const { isMobile } = useSidebar();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await utils.auth.me.invalidate();
  };

  if (!data?.isAuthed) {
    return <LoginDialog />;
  }

  return (
    <SidebarGroup className="p-0">
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <CircleUser className="size-5" />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">Account</span>
                    </div>
                    <MoreVertical className="ml-auto size-4" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    closeOnClick={false}
                    className="min-h-9 justify-between"
                  >
                    Theme
                    <ThemeSwitcher />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
