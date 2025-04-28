"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Listings, PropertyImages } from "@/lib/model/types";
import { format } from "date-fns";
import { parseAsIsoDate, useQueryState } from "nuqs";

interface BookingSummaryProps {
  listing?: Listings & { propertyImages: PropertyImages[] };
  bookedDates: { startDate: Date; endDate: Date }[];
}

export function CheckoutSummary({ listing, bookedDates }: BookingSummaryProps) {
  const [startDate] = useQueryState("startDate", parseAsIsoDate);
  const [endDate] = useQueryState("endDate", parseAsIsoDate);
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

  if (!listing || !startDate || !endDate || isUnavailable) return null;

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Checkout Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">{listing.title}</h3>
          <p className="text-muted-foreground text-sm">{listing.location}</p>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Check-in</span>
            <span className="font-medium">
              {format(startDate, "EEE, MMM d, yyyy")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Check-out</span>
            <span className="font-medium">
              {format(endDate, "EEE, MMM d, yyyy")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Duration</span>
            <span className="font-medium">
              {calculateTotalMonths()}{" "}
              {calculateTotalMonths() === 1 ? "month" : "months"}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between">
            <span>
              £{Number(listing.price).toFixed(2)} × {calculateTotalMonths()}{" "}
              months
            </span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>£{Number(calculateTotalCost()).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
