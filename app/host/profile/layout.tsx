import { AsideMenu } from "@/components/AsideMenu";
import { Cog, Home, User2 } from "lucide-react";

const hostProfileMenuItems = [
  { title: "User", href: "/host/profile/user", icon: <User2 /> },
  { title: "Host Details", href: "/host/profile/host-details", icon: <Home /> },
  { title: "Settings", href: "/host/profile/settings", icon: <Cog /> },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container mx-auto h-full py-6 space-y-4">
      <div className="flex flex-col gap-10 w-full md:flex-row">
        <AsideMenu menuItems={hostProfileMenuItems} />
        {children}
      </div>
    </main>
  );
}
