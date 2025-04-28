import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/model";
import { listings, propertyImages } from "@/lib/model/schema";
import { Listings } from "@/lib/model/types";
import { getSession } from "@/lib/service/get-session";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function HostDashboardMyListingsPage() {
  const session = await getSession();
  const hostId = session?.user?.id;

  if (!hostId) {
    return notFound();
  }

  const hostListings = await db
    .select()
    .from(listings)
    .where(eq(listings.hostId, hostId));

  const getImageForListing = async (listing: Listings) => {
    const listingImages = await db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.listingId, listing.id));

    return listingImages[0]?.imageUrl;
  };

  return (
    <>
      {hostListings.length === 0 ? (
        <p>No listings found. Create a new one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hostListings.map(async (listing) => {
            const listingSrc = await getImageForListing(listing);
            return (
              <Card key={listing.id}>
                <CardHeader className="p-0">
                  {listingSrc ? (
                    <img
                      src={listingSrc}
                      alt={listing.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-secondary rounded-t-lg"></div>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">
                    {listing.title}
                  </CardTitle>
                  <p className="mb-1">£{listing.price}/month</p>
                  <p className="mb-1">{listing.description}</p>
                  <p className="mb-2">
                    {listing.isVerified ? "Verified" : "Under Review"}
                  </p>
                  <Link
                    className={buttonVariants({ variant: "outline" })}
                    href={`/host/dashboard/my-listings/${listing.id}`}
                  >
                    Edit Listing
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
