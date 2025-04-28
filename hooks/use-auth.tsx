"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function useSignOut() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const signOut = async () => {
    setPending(true);
    toast.loading("Signing out...");

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully.");
          router.push("/auth/signin");
        },
        onError: (error) => {
          console.error(error);
          toast.error("Sign out failed: " + error.error.message);
        },
      },
    });

    setPending(false);
    toast.dismiss();
  };

  return { pending, actions: { signOut } };
}
