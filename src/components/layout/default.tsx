import type { ReactNode } from 'react';
import { Header } from '../header';
import { AppSidebar } from '../ui/app-sidebar';
import { SidebarInset } from '../ui/sidebar';

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
