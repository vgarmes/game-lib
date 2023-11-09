import { Gamepad2, Home, Library, LucideIcon, Search } from 'lucide-react';
import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { clsx } from 'clsx';

const MenuButton: React.FC<
  PropsWithChildren<{ href: string; active?: boolean }>
> = ({ children, href, active }) => (
  <Link
    href={href}
    className={clsx(
      'flex flex-col items-center text-xs gap-1 h-full justify-center border-b-2',
      {
        'text-foreground border-b-foreground': active,
        'text-foreground/60 border-b-card': !active,
      }
    )}
  >
    {children}
  </Link>
);

const MobileNav = () => {
  const router = useRouter();
  return (
    <div className="h-16 bg-card mx-auto grid grid-cols-3 items-center">
      <MenuButton href="/" active={router.asPath === '/'}>
        <Home />
        Home
      </MenuButton>
      <MenuButton href="/games" active={router.asPath === '/games'}>
        <Library />
        Library
      </MenuButton>
      <MenuButton href="/platforms" active={router.asPath === '/platforms'}>
        <Gamepad2 />
        Platforms
      </MenuButton>
    </div>
  );
};

export default MobileNav;