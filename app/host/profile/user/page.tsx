import { auth } from "@/lib/auth";
import { Separator } from "@radix-ui/react-separator";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { UpdateUserDetails } from "./update-user-details";
import { getSession } from "@/lib/service/get-session";

export default async function HostProfilePage({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    notFound();
  }
  const user = session.user;

  return (
    <div className="lg:max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">
          These are details primarily used for contacting you and signing in to
          your account.
        </p>
      </div>
      <Separator className="w-full my-4 h-[1px] bg-border" />

      <section className="flex items-center gap-4 w-full">
        <UpdateUserDetails user={user} />
      </section>
    </div>
  );
}
