import type { ReactNode } from 'react';
import Sidebar from '../sidebar';
import MobileNav from '../mobile-nav';
import { Header } from '../header';

type DefaultLayoutProps = { children: ReactNode; withSearch?: boolean };

const DefaultLayout = ({ children, withSearch }: DefaultLayoutProps) => {
  return (
    <div className="w-full flex gap-2 h-full">
      <div className="w-64 hidden sm:block">
        <Sidebar />
      </div>
      <div className="grow sm:overflow-hidden h-full sm:px-1 py-2 sm:rounded-lg sm:border bg-card sm:shadow-sm">
        <div className="h-full sm:overflow-y-auto px-5">
          <Header withSearch={withSearch} />
          <main className="pb-8">{children}</main>
        </div>
      </div>
      <div className="block w-full sm:hidden fixed bottom-0">
        <MobileNav />
      </div>
    </div>
  );
};

export default DefaultLayout;
