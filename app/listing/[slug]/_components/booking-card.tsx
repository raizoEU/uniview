"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSubmission } from "@/hooks/use-submission";
import { Listings } from "@/lib/model/types";
import { format } from "date-fns";
import { CalendarIcon, Star } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { BookedRange } from "./listing-main";
import { useRouter, useSearchParams } from "next/navigation";

interface BookingCardProps {
  listing: Listings;
  averageRating: number;
  reviewCount: number;
  isSaved: boolean | undefined;
  handleSaveToFavourites: () => Promise<void>;
  bookedDatesForListing: BookedRange;
}

function isDateDisabled(
  date: Date,
  bookedRanges: { startDate: Date | null; endDate: Date | null }[],
  availableFrom: Date
) {
  if (date < new Date(availableFrom)) return true;

  return bookedRanges.some(({ startDate, endDate }) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  });
}

export function BookingCard({
  listing,
  averageRating,
  reviewCount,
  isSaved,
  handleSaveToFavourites,
  bookedDatesForListing,
}: BookingCardProps) {
  const { isLoading: isSaveLoading, execute: handleSave } = useSubmission({
    action: async () => {
      await handleSaveToFavourites();
    },
    successMessage: isSaved
      ? "Listing removed successfully"
      : "Listing saved successfully",
    errorMessage: isSaved
      ? "Failed to remove listing"
      : "Failed to save listing",
  });

  const [startDate, setStartDate] = useQueryState("startDate", parseAsIsoDate);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBookNow = () => {
    const params = new URLSearchParams(searchParams);

    if (startDate) {
      params.set("startDate", startDate.toISOString());
    }

    router.push(`/create-booking/${listing.id}?${params.toString()}`);
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-baseline justify-between">
          <span>£{Number(listing.price).toFixed(2)}</span>
          <span className="text-sm font-normal text-muted-foreground">
            per month
          </span>
        </CardTitle>
        <CardDescription>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            <span>
              {averageRating.toFixed(1)} · {reviewCount} reviews
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Available from</h3>
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>{format(listing.availableFrom, "MMMM d, yyyy")}</span>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Select move-in date</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? (
                  format(startDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                defaultMonth={startDate ?? listing.availableFrom ?? new Date()}
                selected={startDate ?? undefined}
                onSelect={(date) => {
                  setStartDate(date ?? null);
                }}
                initialFocus
                disabled={(date) =>
                  isDateDisabled(
                    date,
                    bookedDatesForListing,
                    listing.availableFrom
                  )
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full" onClick={handleBookNow}>
          Book Now
        </Button>
        {isSaved !== undefined && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSave}
            loading={isSaveLoading}
          >
            {isSaved ? "Remove from Favorites" : "Save to Favorites"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
