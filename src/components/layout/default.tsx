import type { ReactNode } from 'react';
import { Header } from '../header';
import { SidebarInset } from '../ui/sidebar';
import { AppSidebar } from '../app-sidebar/app-sidebar';

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="mt-4 mb-8 px-6">{children}</main>
      </SidebarInset>
    </>
  );
};

export default DefaultLayout;
