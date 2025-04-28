import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BadgePoundSterling,
  Bookmark,
  BookOpen,
  Cog,
  GraduationCap,
  Home,
  House,
  LayoutDashboard,
  Library,
  LogIn,
  Search,
  User2,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { NavUser } from "./nav-user";
import { User } from "@/lib/model/types";

interface NavItem {
  title: string;
  url: string;
  icon?: React.ReactNode;
}

interface NavGroup {
  title: string;
  items?: NavItem[];
}

// Data for the side menu
const sideMenuData = (user: any) => {
  return {
    navMain: [
      {
        title: "General",
        items: [
          { title: "Home", url: "/", icon: <Home /> },
          { title: "Search", url: "/search", icon: <Search /> },
        ],
      },
    ] as NavGroup[],
    unauthenticated: [
      {
        title: "User",
        items: [
          { title: "Sign In", url: "/auth/signin", icon: <LogIn /> },
          { title: "Sign Up", url: "/auth/signup", icon: <UserPlus /> },
        ],
      },
    ] as NavGroup[],
    authenticated: user ? getAuthenticatedUserNavItems(user) : undefined,
  };
};

// Nav items specific for an authenticated user
const authenticatedUserNavItems = [
  {
    title: "Your Account",
    items: [
      {
        title: "Profile",
        url: "/profile#",
        icon: <User2 />,
      },
      {
        title: "Bookings",
        url: "/bookings",
        icon: <Library />,
      },
      {
        title: "Saved Listings",
        url: "/saved-listings",
        icon: <Bookmark />,
      },
      {
        title: "Payments",
        url: "/payments",
        icon: <BadgePoundSterling />,
      },
    ],
  },
] as NavGroup[];

// Nav items specific for a host
const hostUserNavItems = [
  {
    title: "Host Account",
    items: [
      {
        title: "Dashboard",
        url: "/host/dashboard",
        icon: <LayoutDashboard />,
      },
      { title: "Profile", url: "/host/profile/user", icon: <User2 /> },
      {
        title: "My Listings",
        url: "/host/dashboard/my-listings",
        icon: <Home />,
      },
      {
        title: "Bookings",
        url: "/host/dashboard/bookings",
        icon: <BookOpen />,
      },
      {
        title: "Earnings",
        url: "/host/dashboard/earnings",
        icon: <BadgePoundSterling />,
      },
    ],
  },
] as NavGroup[];

// Get the nav items for the authenticated user
const getAuthenticatedUserNavItems = (user: User) => {
  if (user.role === "student") return authenticatedUserNavItems;
  if (user.role === "host") return hostUserNavItems;
};

// Nav items for the user dropdown at the bottom of sidebar
export const userDropdownItems = [
  { title: "Profile", url: "/profile", icon: <User2 /> },
] as NavItem[];

export function AppSidebar({
  user,
  className,
}: {
  user: any;
  className?: string;
}) {
  const renderGroup = (dataGroup?: NavGroup[]) => {
    if (!dataGroup) return null;
    return dataGroup.map((group) => (
      <SidebarGroup key={group.title}>
        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {group.items?.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    {item.icon} {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    ));
  };

  return (
    <Sidebar className={className} side="left" collapsible="icon">
      <SidebarContent>
        {user && (
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem className="flex gap-3 items-center">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  {user.role === "student" ? (
                    <GraduationCap className="size-4" />
                  ) : (
                    <House className="size-4" />
                  )}
                </div>
                <span>
                  <p className="capitalize font-semibold text-sm leading-none">
                    {user.role}
                  </p>
                </span>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
        )}

        {renderGroup(sideMenuData(user).navMain)}
        {!user && renderGroup(sideMenuData(user).unauthenticated)}
        {user && renderGroup(sideMenuData(user).authenticated)}
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <NavUser user={user} />
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
