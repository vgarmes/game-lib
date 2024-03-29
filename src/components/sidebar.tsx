import Link from 'next/link';
import { Library, LucideIcon, Home, Search, Plus, Gamepad } from 'lucide-react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { Card } from './ui/card';
import { useSession } from 'next-auth/react';

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

const Sidebar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const userIsAdmin = session?.user.role === 'ADMIN';
  return (
    <nav className="hidden sm:flex p-2 flex-col gap-2 h-full w-64 fixed left-0 top-0 bottom-0">
      <Card className="px-6 py-4 h-full">
        <Link href="/" className="flex items-center gap-2 hover:text-pink-600">
          <Gamepad className="-rotate-45 w-5 h-5" />
          <span className="font-semibold tracking-tight">Game Library</span>
        </Link>
        <ul className="space-y-4 mt-6">
          {navigation.map(({ title, href, Icon }) => (
            <li key={title}>
              <Link
                href={href}
                className={clsx(
                  'flex items-center gap-2 font-semibold hover:text-foreground transition-colors',
                  {
                    'text-foreground': router.asPath === href,
                    'text-muted-foreground': router.asPath !== href,
                  }
                )}
              >
                <Icon className="mr-2 w-4 h-4" />
                <span className="truncate">{title}</span>
              </Link>
            </li>
          ))}

          {userIsAdmin &&
            adminActions.map(({ title, href, Icon }) => (
              <li key={title} className="flex items-center justify-between">
                <Link
                  href={href}
                  className={clsx(
                    'flex items-center gap-2 font-semibold hover:text-foreground transition-colors',
                    {
                      'text-foreground': router.asPath === href,
                      'text-muted-foreground': router.asPath !== href,
                    }
                  )}
                >
                  <Icon className="mr-2 w-4 h-4" />
                  <span className="truncate">{title}</span>
                </Link>
              </li>
            ))}
        </ul>
      </Card>
    </nav>
  );
};

export default Sidebar;
