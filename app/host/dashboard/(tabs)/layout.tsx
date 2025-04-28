"use client";

import { usePathname } from "next/navigation";
import { Tabs, TabsLinkTrigger, TabsList } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const activeTab = pathname;

  return (
    <Tabs value={activeTab}>
      <div className="space-y-4">
        <div className="flex gap-2 items-center w-full justify-between">
          <TabsList>
            <TabsLinkTrigger href="/host/dashboard/my-listings">
              My Listings
            </TabsLinkTrigger>
            <TabsLinkTrigger href="/host/dashboard/bookings">
              Bookings
            </TabsLinkTrigger>
            <TabsLinkTrigger href="/host/dashboard/earnings">
              Earnings
            </TabsLinkTrigger>
          </TabsList>
        </div>
        <Suspense
          fallback={<Loader2 className="animate-spin text-foreground" />}
        >
          {children}
        </Suspense>
      </div>
    </Tabs>
  );
}
