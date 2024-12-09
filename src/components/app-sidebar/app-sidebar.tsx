import { Home, Library, Plus, Gamepad2 } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NavUser } from './nav-user';

// Menu items.
const mainItems = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Platforms',
    url: '/platforms',
    icon: Library,
  },
];

const adminItems = [
  { title: 'Add game', url: '/games/new', icon: Plus },
  { title: 'Add platform', url: '/platforms/new', icon: Plus },
];

export function AppSidebar() {
  const { pathname } = useRouter();
  const { data: session } = useSession();

  const userIsAdmin = session?.user.role === 'ADMIN';

  const groups = [
    { id: 'Main', items: mainItems },
    { id: 'Admin', items: userIsAdmin ? adminItems : [] },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-sidebar-primary-foreground">
                <Gamepad2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Game Library</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {groups
          .filter((group) => group.items.length > 0)
          .map(({ id, items }) => (
            <SidebarGroup key={id}>
              <SidebarGroupLabel>{id}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
