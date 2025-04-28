"use client";

import {
  HostProfiles,
  Listings,
  PropertyImages,
  Reviews as ReviewsTable,
  User,
} from "@/lib/model/types";
import { BookingCard } from "./booking-card";
import { ListingCarousel } from "./listing-carousel";
import { ListingHeader } from "./listing-header";
import { ListingInfo } from "./listing-info";

// Derived types based on tables. These indicate joins in queries.
type Host = Pick<User, "id" | "name" | "image"> &
  Pick<HostProfiles, "biography" | "businessName" | "phoneNumber" | "verified">;
interface Review extends ReviewsTable {
  user: Pick<User, "id" | "name" | "image"> | null;
}
export type BookedRange = { startDate: Date | null; endDate: Date | null }[];

interface ListingMainProps {
  listing: Listings;
  host: Host;
  reviews: Review[];
  propertyImages: PropertyImages[];
  isASavedListing: boolean | undefined;
  handleSaveToFavourites: () => Promise<void>;
  bookedDatesForListing: BookedRange;
}

export function ListingMain({
  listing,
  host,
  reviews,
  propertyImages,
  isASavedListing,
  bookedDatesForListing,
  handleSaveToFavourites,
}: ListingMainProps) {
  const averageRating =
    reviews.reduce((acc, review) => acc + Number(review.rating), 0) /
    reviews.length;

  return (
    <div className="container mx-auto py-8">
      <ListingHeader
        listing={listing}
        isASavedListing={isASavedListing}
        handleSaveToFavourites={handleSaveToFavourites}
      />

      <ListingCarousel propertyImages={propertyImages} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ListingInfo listing={listing} host={host} reviews={reviews} />

        <div>
          <BookingCard
            listing={listing}
            averageRating={averageRating}
            reviewCount={reviews.length}
            isSaved={isASavedListing}
            bookedDatesForListing={bookedDatesForListing}
            handleSaveToFavourites={handleSaveToFavourites}
          />
        </div>
      </div>
    </div>
  );
}
