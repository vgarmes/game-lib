import Link from 'next/link';
import ColorModeToggle from './color-mode-toggle';
import UserMenu from './user-menu';

const MainNav = () => {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="font-bold tracking-tight hover:text-pink-600">
        Game Library
      </Link>
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
