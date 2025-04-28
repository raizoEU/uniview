"use client";

import Image from "next/image";
import {
  BookmarkIcon,
  ExternalLinkIcon,
  MapPinIcon,
  Search,
  StarIcon,
  TrashIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Listings, PropertyImages, Universities } from "@/lib/model/types";
import { savedListings } from "@/lib/model/schema";
import Link from "next/link";
import { useSubmission } from "@/hooks/use-submission";
import { NoSavedListings } from "./no-saved-listings";

type SavedListings = typeof savedListings.$inferSelect;
type ListingsPropertyImagesAndUniversity = Listings & {
  propertyImages: PropertyImages[];
  university: Universities | null;
};
type SavedListingsWithListingsAndPropertyImages = SavedListings & {
  listing: ListingsPropertyImagesAndUniversity | null;
};
interface SavedListingsProps {
  savedListingsData: SavedListingsWithListingsAndPropertyImages[];
  handleRemoveSavedListing: (id: string) => Promise<void>;
}

export function SavedListings({
  savedListingsData,
  handleRemoveSavedListing,
}: SavedListingsProps) {
  const { execute: onRemoveSavedListing, isLoading } = useSubmission({
    action: async (id: string) => {
      console.log("Removing saved listing:", id);
      await handleRemoveSavedListing(id);
    },
    loadingMessage: "Removing saved listing...",
    successMessage: "Saved listing removed successfully",
    errorMessage: "Failed to remove saved listing",
  });

  if (!savedListingsData.length) {
    return <NoSavedListings />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Listings</h1>
          <p className="text-muted-foreground">
            Properties you've bookmarked for future reference.
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {savedListingsData.map(({ listing, id: savedListingId }) => {
          if (!listing) return null;
          return (
            <Card key={listing.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={
                    listing.propertyImages?.[0].imageUrl || "/placeholder.svg"
                  }
                  alt={listing.title ?? "No image available for listing"}
                  fill
                  className="object-cover"
                />
                {listing.isVerified && (
                  <Badge className="absolute right-2 top-2 bg-primary">
                    Verified
                  </Badge>
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-1">
                    {listing.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    loading={isLoading}
                    disabled={isLoading}
                    onClick={() => onRemoveSavedListing(savedListingId)}
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Remove from saved</span>
                  </Button>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPinIcon className="mr-1 h-4 w-4" />
                  <span className="line-clamp-1">{listing.location}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {listing.university?.name}
                  </Badge>
                  <div className="flex items-center text-sm">
                    <StarIcon className="mr-1 h-4 w-4 fill-primary text-primary" />
                    <span>4.8</span>
                  </div>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {listing.description}
                </p>
                <div className="mt-4">
                  <p className="font-semibold text-lg">
                    £{Number(listing.price).toFixed(2)}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      / month
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Available from {listing.availableFrom.toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button className="flex-1">Book Now</Button>
                <Button variant="outline" size="icon">
                  <ExternalLinkIcon className="h-4 w-4" />
                  <span className="sr-only">View Details</span>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
