import { Switch } from '@headlessui/react';
import classNames from 'classnames';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef, useState } from 'react';
import { routes } from '../constants';
import { COLOR_MODE } from '../utils/color-mode';
import useColorMode from '../utils/hooks/useColorMode';
import MobileMenu from './MobileMenu';

function ColorToggle() {
  const { colorMode, setColorMode } = useColorMode();
  const enabled = colorMode === COLOR_MODE.DARK;

  return (
    <Switch
      checked={enabled}
      onChange={() =>
        setColorMode(
          colorMode === COLOR_MODE.DARK ? COLOR_MODE.LIGHT : COLOR_MODE.DARK
        )
      }
      className={`${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span className="sr-only">Color mode</span>
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
}

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
          className={classNames(
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
    <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 p-4">
      <NavLinks />
      <ColorToggle />
      <UserArea />
      <MobileMenu />
    </nav>
  );
};

export default Navbar;
