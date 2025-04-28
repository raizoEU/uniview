import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/model";
import { hostProfiles } from "@/lib/model/schema";
import { getSession } from "@/lib/service/get-session";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { UpdatehostDetails } from "./update-host-details";

export default async function HostProfilePage() {
  const session = await getSession();
  if (!session?.user) {
    notFound();
  }
  const host = (
    await db
      .select()
      .from(hostProfiles)
      .where(eq(hostProfiles.id, session.user.id))
  )[0];

  return (
    <div className="lg:max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Host details</h1>
        <p className="text-muted-foreground">
          These are are details that are specific to you as a host.
        </p>
      </div>
      <Separator className="w-full my-4 h-[1px] bg-border" />

      <section className="flex items-center gap-4 w-full">
        <UpdatehostDetails host={host} />
      </section>
    </div>
  );
}
