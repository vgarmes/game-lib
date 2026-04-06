"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { TRPCReactProvider } from "@/trpc/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        storageKey="color-mode"
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
      >
        <TRPCReactProvider>
          <NuqsAdapter>
            <TooltipProvider>
              <SidebarProvider>
                <AppSidebar variant="sidebar" />
                <SidebarInset>{children}</SidebarInset>
              </SidebarProvider>
            </TooltipProvider>
          </NuqsAdapter>
          {process.env.NODE_ENV !== "production" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </TRPCReactProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
