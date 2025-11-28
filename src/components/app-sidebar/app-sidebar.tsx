import { Home, Library, Plus, Gamepad2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
import { NavAdmin } from "./nav-admin";

// Menu items.
const mainItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Platforms",
    url: "/platforms",
    icon: Library,
  },
];

const adminItems = [
  { title: "Add game", url: "/games/new", icon: Plus },
  { title: "Add platform", url: "/platforms/new", icon: Plus },
];

export function AppSidebar() {
  const { data: session } = useSession();

  const userIsAdmin = session?.user.role === "ADMIN";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! hover:bg-transparent"
            >
              <Link href="/">
                <Gamepad2 className="size-5!" />
                <span className="truncate text-base font-semibold">
                  Game Library
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mainItems} />
        {userIsAdmin && <NavAdmin items={adminItems} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
