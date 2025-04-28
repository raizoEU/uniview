import { db } from "@/lib/model";
import { SavedListings } from "./_components/saved-listings";
import { savedListings } from "@/lib/model/schema";
import { getSession } from "@/lib/service/get-session";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export default async function SavedListingsPage() {
  const session = await getSession();
  // TODO: Unauthorised error instead
  if (!session?.user) notFound();

  const savedListingsData = await db.query.savedListings.findMany({
    where: (savedListings, { eq }) =>
      eq(savedListings.studentId, session.user.id),
    with: {
      listing: {
        with: {
          propertyImages: {
            limit: 1,
          },
          university: true,
        },
      },
    },
  });

  const handleRemoveSavedListing = async (id: string) => {
    "use server";
    console.log("Called saved listing:", id);
    if (!session?.user) return;
    try {
      console.log("Removing saved listing:", {
        id,
        studentId: session.user.id,
      });
      const resp = await db
        .delete(savedListings)
        .where(
          and(
            eq(savedListings.id, id),
            eq(savedListings.studentId, session.user.id)
          )
        )
        .returning();

      console.log("Removed saved listing:", resp);
      revalidatePath("/saved-listings");
    } catch (error) {
      console.error("Error removing saved listing:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <SavedListings
        handleRemoveSavedListing={handleRemoveSavedListing}
        savedListingsData={savedListingsData}
      />
    </div>
  );
}
