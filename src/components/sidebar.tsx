import Link from 'next/link';
import { Library, LucideIcon, Home, Search, Plus, Gamepad } from 'lucide-react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { Card } from './ui/card';

interface NavigationElement {
  title: string;
  href: string;
  Icon: LucideIcon;
}

const primaryNavigation: Array<NavigationElement> = [
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
];

const secondaryNavigation: Array<NavigationElement> = [
  { title: 'Library', href: '/library', Icon: Library },
  { title: 'Add game', href: '/game/new', Icon: Plus },
];

const Sidebar = () => {
  const router = useRouter();
  return (
    <nav className="flex flex-col gap-2 h-full">
      <Card className="px-6 py-4">
        <Link href="/" className="flex items-center gap-2 hover:text-pink-600">
          <Gamepad className="-rotate-45 w-5 h-5" />
          <span className="font-semibold tracking-tight">Game Library</span>
        </Link>
        <ul className="space-y-4 mt-6">
          {primaryNavigation.map(({ title, href, Icon }) => (
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
        </ul>
      </Card>
      <Card className="px-6 py-4 grow">
        <ul className="space-y-4">
          {secondaryNavigation.map(({ title, href, Icon }) => (
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
        </ul>
      </Card>
    </nav>
  );
};

export default Sidebar;
