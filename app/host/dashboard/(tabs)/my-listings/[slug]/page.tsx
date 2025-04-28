import { db } from "@/lib/model";
import { listings, propertyImages, universities } from "@/lib/model/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { UpdateListingDetails } from "../../../_components/listing/update-listing-details";
import UploadImages from "../../../_components/listing/upload-images";

export default async function HostDashboardListingPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  if (!slug) {
    return notFound();
  }

  const listingQuery = await db
    .select()
    .from(listings)
    .where(eq(listings.id, slug));

  if (!listingQuery.length) {
    return notFound();
  }

  const listing = listingQuery[0];

  const allUniversities = await db.select().from(universities);
  const universityQuery = await db
    .select()
    .from(universities)
    .where(eq(universities.id, listing.universityId!));
  const university = universityQuery[0];

  const imagesQuery = await db
    .select()
    .from(propertyImages)
    .where(eq(propertyImages.listingId, listing.id));

  const revalidatePathOnServer = async () => {
    "use server";
    revalidatePath(`/host/dashboard/my-listings/${listing.id}`);
  };

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
        {listing.title}
      </h1>
      <UpdateListingDetails
        listing={listing}
        listingUniversity={university}
        allUniversities={allUniversities}
      />
      <div>
        <UploadImages
          revalidatePathOnServer={revalidatePathOnServer}
          listingId={listing.id}
          images={imagesQuery}
        />
      </div>
    </section>
  );
}

export const dynamic = "force-dynamic";
