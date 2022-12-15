import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import Link from 'next/link';
import { forwardRef, Fragment } from 'react';

const MenuItem = forwardRef<
  HTMLAnchorElement,
  { children: React.ReactNode; href: string; active: boolean }
>(({ children, href, active, ...rest }, ref) => {
  return (
    <Link href={href} passHref>
      <a
        ref={ref}
        className={classNames(
          'block w-full cursor-pointer rounded-md px-2 py-2 text-sm',
          {
            'bg-pink-700 text-white': active,
            'text-gray-900': !active,
          }
        )}
        {...rest}
      >
        {children}
      </a>
    </Link>
  );
});
MenuItem.displayName = 'MenuItem';

function MobileMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left md:hidden">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className=" absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <MenuItem href="/games" active={active}>
                  Games
                </MenuItem>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <MenuItem href="/platforms" active={active}>
                  Platforms
                </MenuItem>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default MobileMenu;
