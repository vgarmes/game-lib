import { Gamepad2, Home, Library, LucideIcon, Search } from 'lucide-react';
import { PropsWithChildren } from 'react';
import Link from 'next/link';

const MenuButton: React.FC<PropsWithChildren<{ href: string }>> = ({
  children,
  href,
}) => (
  <Link href={href} className="flex flex-col items-center text-xs gap-1">
    {children}
  </Link>
);

const MobileNav = () => {
  return (
    <div className="w-full h-16 bg-muted mx-auto max-w-sm rounded-full flex justify-center items-center gap-12 p-3">
      <MenuButton href="/">
        <Home />
        Home
      </MenuButton>
      <MenuButton href="/games">
        <Library />
        Library
      </MenuButton>
      <MenuButton href="/platforms">
        <Gamepad2 />
        Platforms
      </MenuButton>
    </div>
  );
};

export default MobileNav;
