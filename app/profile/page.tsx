import { db } from "@/lib/model";
import { ProfileSettings } from "./_components/profile-settings";
import { getSession } from "@/lib/service/get-session";
import { notFound } from "next/navigation";
import { hostProfiles } from "@/lib/model/schema";

export default async function ProfilePage() {
  const session = await getSession();
  // TODO: Unauthorised error instead
  if (!session?.user) {
    return notFound();
  }

  const query = await db.query.studentstay_user.findFirst({
    where: (studentstay_user, { eq }) =>
      eq(studentstay_user.id, session.user.id),
    with: {
      studentProfiles: {
        limit: 1,
      },
    },
  });

  return (
    <div className="container mx-auto py-8">
      {query && (
        <ProfileSettings
          userData={{ ...query, studentProfiles: query.studentProfiles?.[0] }}
        />
      )}
    </div>
  );
}
