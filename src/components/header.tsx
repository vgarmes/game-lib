import { routes } from '@/constants';
import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import ColorModeToggle from './color-mode-toggle';
import UserMenu from './user-menu';

const MainNav = () => {
  const router = useRouter();
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="font-bold tracking-tight hover:text-pink-600">
        Game Library
      </Link>
      {routes.map(({ id, href }) => (
        <Link
          key={id}
          href={href}
          className={clsx(
            'text-sm font-medium transition-colors hover:text-primary text-muted-foreground',
            {
              'text-primary': router.asPath === href,
            }
          )}
        >
          {id}
        </Link>
      ))}
    </nav>
  );
};

export const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center px-4">
      <MainNav />
      <div className="ml-auto flex items-center space-x-4">
        <ColorModeToggle />
        <UserMenu />
      </div>
    </header>
  );
};
