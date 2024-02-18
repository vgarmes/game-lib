import type { ReactNode } from 'react';
import Sidebar from '../sidebar';
import MobileNav from '../mobile-nav';
import { Header } from '../header';

type DefaultLayoutProps = { children: ReactNode; withSearch?: boolean };

const DefaultLayout = ({ children, withSearch }: DefaultLayoutProps) => {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="px-3 sm:ml-64">
        <Header withSearch={withSearch} />
        <main className="mt-4 mb-8">{children}</main>
      </div>
      <div className="block w-full sm:hidden fixed bottom-0">
        <MobileNav />
      </div>
    </div>
  );
};

export default DefaultLayout;
