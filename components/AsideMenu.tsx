"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AsideMenu({
  menuItems,
}: {
  menuItems: { title: string; href: string; icon: React.ReactNode }[];
}) {
  const segment = usePathname().split("/").at(-1);

  return (
    <aside className="h-full flex flex-col gap-0.5 w-full md:flex-row md:w-1/5">
      <ul>
        {menuItems.map((menuItem) => (
          <Link
            href={menuItem.href}
            key={menuItem.href}
            className={cn(
              buttonVariants({ variant: "link" }),
              "w-full text-start justify-start -mx-4",
              segment === menuItem.href.split("/").at(-1) &&
                "bg-secondary text-secondary-foreground hover:no-underline"
            )}
          >
            {menuItem.icon}
            {menuItem.title}
          </Link>
        ))}
      </ul>
    </aside>
  );
}
