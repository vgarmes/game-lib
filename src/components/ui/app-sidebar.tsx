import { Home, Library, Plus, Gamepad, Gamepad2 } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
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
import { SearchForm } from '../sidebar/search-form';

// Menu items.
const mainItems = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Library',
    url: '/library',
    icon: Library,
  },
];

const adminItems = [
  { title: 'Add game', url: '/games/new', icon: Plus },
  { title: 'Add platform', url: '/platforms/new', icon: Plus },
];

function useSidebarGroups() {
  const { data: session } = useSession();
  const userIsAdmin = session?.user.role === 'ADMIN';

  return [
    { id: 'Main', items: mainItems },
    { id: 'Admin', items: userIsAdmin ? adminItems : [] },
  ];
}

export function AppSidebar() {
  const groups = useSidebarGroups();
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <Link
              href="/"
              className="flex items-center gap-2 hover:text-pink-600"
            >
              <Gamepad2 className="size-5" />
              <span className="font-semibold">Game Library</span>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {groups.map(({ id, items }) => (
          <SidebarGroup key={id}>
            <SidebarGroupLabel>{id}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
