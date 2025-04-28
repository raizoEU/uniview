import { studentstay_user } from "@/auth-schema";
import { db } from "@/lib/model";
import {
  bookings,
  hostProfiles,
  listings,
  propertyImages,
  reviews,
  savedListings,
} from "@/lib/model/schema";
import { getSession } from "@/lib/service/get-session";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { ListingMain } from "./_components/listing-main";

interface ListingPageProps {
  params: {
    slug: string;
  };
}

async function getBookedDates(listingId: string) {
  const bookedRanges = await db
    .select({
      startDate: bookings.startDate,
      endDate: bookings.endDate,
    })
    .from(bookings)
    .where(eq(bookings.listingId, listingId));

  return bookedRanges;
}

export default async function ListingPage({ params }: ListingPageProps) {
  // Fetch user session
  const session = await getSession();

  // Fetch the listing and related data
  const listingResult = await db
    .select()
    .from(listings)
    .where(eq(listings.id, params.slug))
    .limit(1);

  if (!listingResult[0]) {
    notFound();
  }

  const listing = listingResult[0];

  // Fetch the host with profile
  const hostResult = await db
    .select({
      id: studentstay_user.id,
      name: studentstay_user.name,
      email: studentstay_user.email,
      image: studentstay_user.image,
      biography: hostProfiles.biography,
      businessName: hostProfiles.businessName,
      phoneNumber: hostProfiles.phoneNumber,
      verified: hostProfiles.verified,
    })
    .from(studentstay_user)
    .leftJoin(hostProfiles, eq(studentstay_user.id, hostProfiles.id))
    .where(eq(studentstay_user.id, listing.hostId ?? ""))
    .limit(1);

  if (!hostResult[0]) {
    notFound();
  }
  // Fetch property images
  const images = await db
    .select()
    .from(propertyImages)
    .where(eq(propertyImages.listingId, listing.id));

  // Fetch reviews with user details
  const listingReviews = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      review: reviews.review,
      createdAt: reviews.createdAt,
      updatedAt: reviews.updatedAt,
      userId: reviews.userId,
      listingId: reviews.listingId,
      user: {
        id: studentstay_user.id,
        name: studentstay_user.name,
        image: studentstay_user.image,
      },
    })
    .from(reviews)
    .leftJoin(studentstay_user, eq(reviews.userId, studentstay_user.id))
    .where(eq(reviews.listingId, listing.id));

  const isASavedListing = session?.user
    ? (
        await db
          .select()
          .from(savedListings)
          .where(
            and(
              eq(savedListings.listingId, listing.id),
              eq(savedListings.studentId, session.user.id)
            )
          )
      ).length > 0
    : undefined;

  const handleSaveToFavourites = async () => {
    "use server";
    const session = await getSession();
    if (session?.user) {
      console.log(isASavedListing);
      const studentId = session.user.id;
      try {
        if (isASavedListing === undefined) {
          console.log("Not logged in");
        }
        if (isASavedListing) {
          console.log("Deleting saved listing");
          await db
            .delete(savedListings)
            .where(
              and(
                eq(savedListings.listingId, listing.id),
                eq(savedListings.studentId, studentId)
              )
            );
        } else {
          console.log("Adding saved listing");
          await db.insert(savedListings).values({
            id: crypto.randomUUID(),
            studentId,
            listingId: listing.id,
          });
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
      revalidatePath(`/listing/${listing.id}`);
    }
  };

  const bookedDatesForListing = await getBookedDates(listing.id);

  return (
    <ListingMain
      listing={listing}
      host={hostResult[0]}
      reviews={listingReviews}
      isASavedListing={isASavedListing}
      propertyImages={images}
      handleSaveToFavourites={handleSaveToFavourites}
      bookedDatesForListing={bookedDatesForListing}
    />
  );
}

export const dynamic = "force-dynamic";
