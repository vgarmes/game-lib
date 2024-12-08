import Link from 'next/link';
import { Library, LucideIcon, Home, Search, Plus, Gamepad } from 'lucide-react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import SidebarListItem from './sidebar-item';

interface NavigationElement {
  title: string;
  href: string;
  Icon: LucideIcon;
}

const navigation: Array<NavigationElement> = [
  {
    title: 'Home',
    href: '/',
    Icon: Home,
  },
  {
    title: 'Search',
    href: '/search',
    Icon: Search,
  },
  {
    title: 'Library',
    href: '/library',
    Icon: Library,
  },
];

const adminActions: Array<NavigationElement> = [
  { title: 'Add game', href: '/games/new', Icon: Plus },
  { title: 'Add platform', href: '/platforms/new', Icon: Plus },
];

function useSidebar(): Array<NavigationElement> {
  const { data: session } = useSession();
  const userIsAdmin = session?.user.role === 'ADMIN';

  return [...navigation, ...(userIsAdmin ? adminActions : [])];
}

const Sidebar = () => {
  const router = useRouter();
  const routes = useSidebar();
  return (
    <div className="hidden sm:flex flex-col bg-neutral-50 dark:bg-neutral-900 border-r h-full w-64 fixed left-0 top-0 bottom-0">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2 hover:text-pink-600">
          <Gamepad className="-rotate-45 w-5 h-5" />
          <span className="font-semibold tracking-tight">Game Library</span>
        </Link>
      </div>
      <nav className="flex-auto overflow-y-auto p-4">
        <ul className="flex flex-col gap-2">
          {routes.map(({ title, href, Icon }) => {
            const isActive = router.asPath === href;
            return (
              <SidebarListItem
                key={title}
                title={title}
                isActive={isActive}
                href={href}
                Icon={Icon}
              />
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
