import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Listings } from "@/lib/model/types";
import { FeaturedListingsResponse } from "@/lib/service/featured-listings";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export interface ListingCardProps {
  listing: Listings & {
    university: {
      name: string | null;
    } | null;
    propertyImages:
      | {
          imageUrl: string | null;
        }[]
      | null;
  };
  href?: string;
}

export function ListingCard({ listing, href }: ListingCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={listing.propertyImages?.[0]?.imageUrl ?? "/placeholder.jpg"}
            alt={listing.title}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-0.5 mt-4">{listing.title}</h3>
        <p className="text-muted-foreground mb-4 grow">{listing.description}</p>
        <p className="text-sm text-muted-foreground mb-1.5">
          Available from: {format(new Date(listing.availableFrom), "PPP")}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">
            £{Number(listing.price).toFixed(2)}
          </span>
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground">
              {listing.location}
            </span>
            {listing.university?.name && (
              <span className="text-sm text-muted-foreground">
                {listing.university?.name}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={href ?? `/listing/${listing.id}`}
          className={buttonVariants({
            variant: "secondary",
            className: "w-full",
          })}
        >
          View Listing
        </Link>
      </CardFooter>
    </Card>
  );
}
