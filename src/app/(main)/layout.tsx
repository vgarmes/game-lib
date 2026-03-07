import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { Header } from "@/components/header";
import { SidebarInset } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="mt-4 mb-8 px-6">{children}</div>
      </SidebarInset>
    </>
  );
}
