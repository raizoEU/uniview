"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Listings, PropertyImages } from "@/lib/model/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { parseAsIsoDate, useQueryState } from "nuqs";

interface BookingSummaryProps {
  listing?: Listings & { propertyImages: PropertyImages[] };
  bookedDates: { startDate: Date; endDate: Date }[];
  isHost: boolean;
}

export function BookingSummary({
  listing,
  bookedDates,
  isHost,
}: BookingSummaryProps) {
  const [startDate] = useQueryState("startDate", parseAsIsoDate);
  const [endDate] = useQueryState("endDate", parseAsIsoDate);

  if (!listing) return null;

  const isUnavailable =
    startDate && endDate
      ? bookedDates.some(
          ({ startDate: bookedStart, endDate: bookedEnd }) =>
            startDate <= bookedEnd && endDate >= bookedStart
        )
      : false;

  const calculateTotalMonths = () => {
    if (!startDate || !endDate) return 0;

    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const startDay = startDate.getDate();

    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    const endDay = endDate.getDate();

    let totalMonths = endMonth - startMonth + (endYear - startYear) * 12;

    if (endDay > startDay) {
      totalMonths += 1;
    }

    return Math.max(totalMonths, 1);
  };

  const calculateTotalCost = () => {
    const totalMonths = calculateTotalMonths();
    return totalMonths > 0 ? Number(listing?.price) * totalMonths : undefined;
  };

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  if (startDate) {
    params.set("startDate", startDate.toISOString());
  }

  const linkToPayment = `/create-booking/${
    listing.id
  }/checkout?${params.toString()}`;

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Listing</h3>
          <p className="text-muted-foreground">{listing?.title}</p>
        </div>
        <div className="flex justify-between">
          <span>Price per month</span>
          <span>£{listing?.price}</span>
        </div>

        {startDate && endDate ? (
          <>
            {isUnavailable ? (
              <div className="text-sm text-red-500">
                Selected dates are unavailable. Please choose a different range
                of dates.
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>Total Months</span>
                  <span>{calculateTotalMonths()}</span>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>£{calculateTotalCost()?.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
            {isUnavailable || isHost ? (
              <Button className="w-full mt-4" disabled>
                Proceed to Payment
              </Button>
            ) : (
              <Button className="w-full mt-4" asChild>
                <Link href={linkToPayment}>Proceed to Payment</Link>
              </Button>
            )}
          </>
        ) : (
          <div className="text-sm text-muted-foreground">
            Select dates to see total price
          </div>
        )}
      </CardContent>
    </Card>
  );
}
