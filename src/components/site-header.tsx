"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

interface Props {
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
}

export function SiteHeader({ breadcrumbs, actions }: Props) {
  const pathname = usePathname();
  return (
    <header className="bg-background sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        {breadcrumbs && (
          <>
            <Separator
              orientation="vertical"
              className="mr-1 h-4 data-vertical:self-center"
            />
            {breadcrumbs}
          </>
        )}
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      </div>
    </header>
  );
}
