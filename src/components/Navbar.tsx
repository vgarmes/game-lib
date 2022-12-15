import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { forwardRef } from 'react';
import MobileMenu from './MobileMenu';

const UserArea = () => {
  const { data: session } = useSession();
  if (!session) {
    return (
      <Link href="/auth/signin" passHref>
        <a className="rounded-md border border-pink-700 bg-pink-600 px-4 py-2 font-medium shadow-sm hover:border-pink-800 hover:bg-pink-700">
          Sign in
        </a>
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <p className="px-4 py-2 font-medium">{session.user?.name}</p>

      <button
        className="rounded-md border border-pink-700 px-4 py-2 font-medium shadow-sm hover:border-pink-800"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </div>
  );
};

const NavLinks = () => {
  return (
    <div className="flex flex-1 items-center">
      <Link href="/" passHref>
        <a className="font-bold tracking-tight">GAMELIB</a>
      </Link>
      <div className="hidden md:ml-10 md:flex">
        <NavLink title="Games" href="/games" />
        <NavLink title="Platforms" href="/platforms" />
      </div>
    </div>
  );
};

interface LinkProps {
  title: string;
  href: string;
}
const NavLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ title, href }, ref) => {
    return (
      <Link href={href} passHref>
        <a ref={ref} className="px-4 py-2 font-medium hover:text-gray-300">
          {title}
        </a>
      </Link>
    );
  }
);
NavLink.displayName = 'NavLink';

const Navbar = () => {
  return (
    <nav className="mx-auto flex w-full max-w-7xl items-center justify-between p-4">
      <NavLinks />
      <UserArea />
      <MobileMenu />
    </nav>
  );
};

export default Navbar;
