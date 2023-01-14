import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import ColorModeToggle from './color-mode-toggle';
import MenuItem from './common/menu-item';
import Icon from './icon';

function MobileMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left md:hidden">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-transparent p-2 text-sm font-medium transition-colors hover:border-slate-900 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hover:dark:border-slate-100">
          <Icon name="bars" size="lg" />
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
          <div className="px-1 py-1">
            <ColorModeToggle />
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default MobileMenu;
