"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { Loader2, LogOut, User, Home, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import ModeToggle from "../ui/mode-toggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const AuthContent = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const fallbackImage = "https://picsum.photos/200";

  if (isPending) {
    return (
      <div className="flex items-center">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (session) {
    const userIcon =
      session.user.role === "student" ? <GraduationCap /> : <Home />;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center relative">
          <Avatar>
            <AvatarImage src={session.user.image ?? fallbackImage} />
            <AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Badge
            variant="default"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 p-0.5"
          >
            {session.user.role === "student" ? (
              <GraduationCap className="text-xs w-4 h-4" />
            ) : (
              <Home className="text-xs w-4 h-4" />
            )}
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Welcome {session.user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            {userIcon} {session.user.role === "student" ? "Student" : "Host"}{" "}
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <ModeToggle />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              setIsSigningOut(true);
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/auth/signin");
                  },
                },
              });
              setIsSigningOut(false);
            }}
          >
            {isSigningOut ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <LogOut />
            )}
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <button
      onClick={() => router.push("/auth/signin")}
      className={buttonVariants({ variant: "ghost" })}
    >
      Sign In
    </button>
  );
};

export default AuthContent;
