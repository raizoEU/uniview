"use client";

import * as React from "react";
import {
  Home,
  Search,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Settings,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface UniversitySidebarProps {
  user?: User;
}

export function UniversitySidebar({ user }: UniversitySidebarProps) {
  return (
    <SidebarProvider>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[300px]">
          <Sidebar className="border-r-0">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-primary p-1">
                        <Home className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <span className="font-bold">UniView</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Home</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/search">
                      <Search className="mr-2 h-4 w-4" />
                      <span>Search</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {user && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                {user ? (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        size="lg"
                        className="w-full justify-start"
                      >
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                          <span className="font-semibold">
                            {user.name || "Guest"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.email || "No email"}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                ) : (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/auth/signin">
                          <LogIn className="mr-2 h-4 w-4" />
                          <span>Sign In</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/auth/signup">
                          <UserPlus className="mr-2 h-4 w-4" />
                          <span>Sign Up</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
        </SheetContent>
      </Sheet>
    </SidebarProvider>
  );
}
