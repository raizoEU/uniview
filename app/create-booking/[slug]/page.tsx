import { db } from "@/lib/model";
import { getSession } from "@/lib/service/get-session";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ListingSummary from "../_components/listing-summary";
import { getListingById } from "@/lib/service/listings";
import { DateSelection } from "../_components/date-selection";
import { getBookedDates } from "@/lib/service/bookings";
import { Listings, PropertyImages } from "@/lib/model/types";
import { BookingSummary } from "../_components/booking-summary";

type ListingWithPropertyImages = Listings & {
  propertyImages: PropertyImages[];
};

export default async function CreateBookingPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const session = await getSession();

  if (!session || !slug) {
    return notFound();
  }

  const listingSummaryData = await getListingById(slug);
  const bookedDates = await getBookedDates(slug);
  const isHost = session.user.role === "host";

  return (
    <div className="container mx-auto py-3 pb-12">
      <h1 className="text-3xl font-bold mb-6">Select Dates</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        <div className="lg:col-span-2 space-y-8">
          <Suspense fallback={<Loader2 />}>
            <ListingSummary listing={listingSummaryData} />
          </Suspense>

          <Suspense fallback={<div>Loading dates...</div>}>
            <DateSelection
              bookedDates={bookedDates}
              listing={listingSummaryData}
            />
          </Suspense>
        </div>

        <div className="lg:col-span-1">
          <Suspense fallback={<div>Loading summary...</div>}>
            <BookingSummary
              bookedDates={bookedDates}
              listing={listingSummaryData}
              isHost={isHost}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
