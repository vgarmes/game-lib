import type { ReactNode } from 'react';
import Sidebar from '../sidebar';
import MobileNav from '../mobile-nav';

type DefaultLayoutProps = { children: ReactNode };

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="mx-auto w-full pb-10 flex items-start grow">
      <div className="sticky top-0 max-h-[calc(100dvh - 4rem)] w-56 hidden sm:block">
        <Sidebar />
      </div>
      <div className="grow">{children}</div>
      <div className="block w-full sm:hidden fixed bottom-0">
        <MobileNav />
      </div>
    </div>
  );
};

export default DefaultLayout;
