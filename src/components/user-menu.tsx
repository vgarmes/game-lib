import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { signOut } from 'next-auth/react';
import { Fragment } from 'react';
import MenuItem from './common/menu-item';

interface Props {
  username: string;
}

const getInitials = (name: string) => {
  let initials = '';
  const splitName = name.split(' ');
  const LENGTH = 2;
  for (let i = 0; i < LENGTH; i++) {
    if (typeof splitName[i] !== 'undefined') {
      initials += splitName[i][0];
    }
  }
  return initials;
};

const UserMenu: React.FC<Props> = ({ username }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-50 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
          <span className="font-medium uppercase text-gray-600 dark:text-gray-300">
            {getInitials(username)}
          </span>
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
                <MenuItem href="/settings" active={active}>
                  Settings
                </MenuItem>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={clsx(
                    'block w-full cursor-pointer rounded-md border border-pink-600 px-2 py-2 text-sm text-pink-600',
                    {
                      'bg-pink-100': active,
                    }
                  )}
                  onClick={() => signOut()}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserMenu;
