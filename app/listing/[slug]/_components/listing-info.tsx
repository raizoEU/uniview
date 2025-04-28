"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HostProfiles, Listings, Reviews, User } from "@/lib/model/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MapPin, Star, User as UserIcon, Verified } from "lucide-react";

type Host = Pick<User, "id" | "name" | "image"> &
  Pick<HostProfiles, "biography" | "businessName" | "phoneNumber" | "verified">;
interface Review extends Reviews {
  user: Pick<User, "id" | "name" | "image"> | null;
}

interface ListingInfoProps {
  listing: Listings;
  host: Host;
  reviews: Review[];
}

export function ListingInfo({ listing, host, reviews }: ListingInfoProps) {
  const averageRating =
    reviews.reduce((acc, review) => acc + Number(review.rating), 0) /
    reviews.length;

  return (
    <div className="lg:col-span-2">
      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Avatar>
                {host.image && <AvatarImage src={host.image} alt={host.name} />}
                <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Hosted by {host.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {host.verified && (
                    <span className="flex items-center">
                      <Verified className="h-3 w-3 mr-1 text-blue-500" />
                      Verified Host
                    </span>
                  )}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {host.biography}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">About this property</h3>
            <p className="text-muted-foreground">{listing.description}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Location</h3>
            <div className="rounded-lg overflow-hidden bg-muted h-[200px] relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary" />
                <span className="sr-only">Map location</span>
              </div>
              <div className="absolute bottom-4 left-4 bg-background/90 px-3 py-1.5 rounded-md text-sm">
                {listing.location}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-5 w-5",
                      star <= Math.floor(averageRating)
                        ? "text-yellow-400 fill-current"
                        : star - 0.5 <= averageRating
                        ? "text-yellow-400 fill-current"
                        : "text-muted stroke-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <span className="font-medium">{averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({reviews.length} reviews)
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="pb-6 border-b last:border-0">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={review.user?.image ?? undefined}
                      alt={review.user?.name ?? "User"}
                    />
                    <AvatarFallback>
                      <UserIcon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{review.user?.name}</h4>
                    {review.createdAt && (
                      <p className="text-xs text-muted-foreground">
                        {format(review.createdAt, "MMMM yyyy")}
                      </p>
                    )}
                  </div>
                  <div className="ml-auto flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span>{Number(review.rating).toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{review.review}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
