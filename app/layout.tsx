import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import QueryProvider from "@/providers/query-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { getSession } from "@/lib/service/get-session";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniView",
  description: "Find your perfect student accommodation",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const user = session?.user;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-background min-h-screen")}>
        <SidebarProvider defaultOpen={false}>
          <div className="flex min-h-screen w-full">
            <div className="">
              <Suspense
                fallback={
                  <div className="h-full bg-secondary border-r border-border" />
                }
              >
                <AppSidebar user={user} />
              </Suspense>
            </div>

            <div className="flex-1 h-full">
              <ThemeProvider attribute="class" defaultTheme="light">
                <NextSSRPlugin
                  routerConfig={extractRouterConfig(ourFileRouter)}
                />
                <QueryProvider>
                  <NuqsAdapter>
                    <div className="flex flex-col h-full">
                      <Navbar />
                      <div className="grow">{children}</div>
                    </div>
                  </NuqsAdapter>
                  <Toaster richColors closeButton />
                </QueryProvider>
              </ThemeProvider>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
