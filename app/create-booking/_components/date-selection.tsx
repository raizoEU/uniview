"use client";
import { BookedRange } from "@/app/listing/[slug]/_components/listing-main";
import { Calendar } from "@/components/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Listings, PropertyImages } from "@/lib/model/types";
import { addMonths } from "date-fns";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { DateRange } from "react-day-picker";

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

interface DateSelectionProps {
  listing?: Listings & { propertyImages: PropertyImages[] };
  bookedDates: BookedRange;
}

export function DateSelection({ listing, bookedDates }: DateSelectionProps) {
  const [startDate, setStartDate] = useQueryState("startDate", parseAsIsoDate);
  const [endDate, setEndDate] = useQueryState("endDate", parseAsIsoDate);

  const handleSelect = (dateRange?: DateRange) => {
    setStartDate(dateRange?.from ?? null);
    setEndDate(dateRange?.to ?? null);
  };

  if (!listing) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Select Dates</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-3 md:flex-row">
        <Calendar
          initialFocus
          className="w-full flex justify-center rounded-md border"
          mode="range"
          numberOfMonths={2}
          defaultMonth={startDate ?? listing.availableFrom ?? new Date()}
          selected={{ from: startDate ?? undefined, to: endDate ?? undefined }}
          onSelect={handleSelect}
          disabled={(date) =>
            isDateDisabled(date, bookedDates, listing.availableFrom)
          }
        />
      </CardContent>
      <CardFooter className="flex gap-3">
        {startDate && !endDate && (
          <Button
            type="submit"
            variant="outline"
            onClick={() => {
              setEndDate(addMonths(startDate, 1));
            }}
          >
            Select Month
          </Button>
        )}
        <Button
          type="submit"
          variant="outline"
          onClick={() => {
            setEndDate(null);
            setStartDate(null);
          }}
        >
          Clear Dates
        </Button>
      </CardFooter>
    </Card>
  );
}

function BookingDetails() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Details</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 md:flex-row"></CardContent>
    </Card>
  );
}
