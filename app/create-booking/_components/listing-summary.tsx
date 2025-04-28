"use client";

import { Listings, PropertyImages } from "@/lib/model/types";
import Image from "next/image";
import { parseAsIsoDate, useQueryState } from "nuqs";

type ListingsWithImages = Listings & { propertyImages: PropertyImages[] };

interface ListingSummaryProps {
  listing?: ListingsWithImages;
}

export default function ListingSummary({ listing }: ListingSummaryProps) {
  const [startDate, setStartDate] = useQueryState("startDate", parseAsIsoDate);
  if (!listing) {
    return null;
  }

  console.log(startDate);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
        {listing.propertyImages && listing.propertyImages.length > 0 ? (
          <Image
            src={listing.propertyImages[0].imageUrl || "/placeholder.svg"}
            alt={listing.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <p className="text-muted-foreground">No image available</p>
          </div>
        )}
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold">{listing.title}</h2>
        <p className="text-muted-foreground mt-2">{listing.location}</p>
        <div className="mt-4">
          <p className="text-lg font-medium">£{listing.price} per month</p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Description</h3>
          <p className="text-muted-foreground">{listing.description}</p>
        </div>
      </div>
    </div>
  );
}
