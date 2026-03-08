import type { LucideProps } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }[];
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="flex flex-col gap-1">
          {items.map((item) => (
            <SidebarMenuItem
              key={item.title}
              className="flex items-center gap-2"
            >
              <SidebarMenuButton
                className="hover:bg-primary/90 hover:text-primary-foreground data-active:bg-primary/90 data-active:text-primary-foreground min-w-8 font-normal duration-200 ease-linear data-active:font-normal"
                render={
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                }
                isActive={
                  item.url === "/"
                    ? pathname === item.url
                    : pathname.startsWith(item.url)
                }
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
