import clsx from 'clsx';
import Link from 'next/link';
import { forwardRef } from 'react';

const MenuItem = forwardRef<
  HTMLAnchorElement,
  { children: React.ReactNode; href: string; active: boolean }
>(({ children, href, active, ...rest }, ref) => {
  return (
    <Link
      href={href}
      className={clsx(
        'block w-full cursor-pointer rounded-md px-2 py-2 text-sm text-gray-900',
        {
          'text-pink-600': active,
        }
      )}
      {...rest}
    >
      {children}
    </Link>
  );
});
MenuItem.displayName = 'MenuItem';

export default MenuItem;
