"use client";

import { authClient } from "@/lib/auth-client";
import { Bell, LogIn, Moon, Sun, UserPlus } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

export function Navbar() {
  const theme = useTheme();
  const { data } = authClient.useSession();

  return (
    <nav className="py-4 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto flex gap-3 justify-between items-center">
        <div className="flex items-center gap-3">
          <Separator orientation="vertical" />
          <SidebarTrigger className="-ml-5" />
          <Link href="/" className="text-lg font-bold">
            UniView
          </Link>
        </div>

        <div className="flex items-center gap-1.5 -mr-2 h-full">
          {!data?.session && (
            <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
              <Link href="/auth/signin">
                <LogIn className="h-7 w-7" />
              </Link>
            </Button>
          )}

          {!data?.session && (
            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
              <Link href="/auth/signup">
                <UserPlus className="h-7 w-7" />
              </Link>
            </Button>
          )}

          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() =>
              theme.setTheme(theme.theme === "dark" ? "light" : "dark")
            }
          >
            {theme.theme === "dark" ? (
              <Sun className="h-7 w-7" />
            ) : (
              <Moon className="h-7 w-7" />
            )}
          </Button>

          {data?.session && (
            <Button size="icon" variant="ghost" className="h-7 w-7">
              <Bell />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
