import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef, useState } from 'react';
import { routes } from '../constants';
import ColorModeToggle from './color-mode-toggle';
import MobileMenu from './MobileMenu';
import UserMenu from './user-menu';
import clsx from 'clsx';
import { buttonVariants } from './ui/button';

const UserArea = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  if (!session) {
    return (
      <Link href="/auth/signin" passHref>
        <a className={buttonVariants({ variant: 'default' })}>Sign in</a>
      </Link>
    );
  }

  return <UserMenu username={session.user.username} />;
};

const NavLinks = () => {
  const router = useRouter();
  return (
    <div className="flex flex-1 items-center">
      <Link href="/" passHref>
        <a className="font-bold tracking-tight hover:text-pink-600">GAMELIB</a>
      </Link>
      <div className="hidden md:ml-10 md:flex">
        {routes.map(({ id, href }) => (
          <NavLink key={id} title={id} href={href} />
        ))}
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
    const router = useRouter();
    return (
      <Link href={href} passHref>
        <a
          ref={ref}
          className={clsx(
            'px-4 py-2 font-medium hover:text-pink-600 dark:hover:text-gray-300',
            {
              'underline decoration-pink-600 decoration-4 underline-offset-4':
                router.asPath === href,
            }
          )}
        >
          {title}
        </a>
      </Link>
    );
  }
);
NavLink.displayName = 'NavLink';

const Navbar = () => {
  return (
    <nav className="mx-auto flex w-full items-center justify-between gap-3 p-4">
      <NavLinks />
      <div className="hidden md:block">
        <ColorModeToggle />
      </div>
      <UserArea />
      <MobileMenu />
    </nav>
  );
};

export default Navbar;
