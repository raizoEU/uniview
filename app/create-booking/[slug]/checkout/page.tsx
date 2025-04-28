import { getBookedDates } from "@/lib/service/bookings";
import { getSession } from "@/lib/service/get-session";
import { getListingById } from "@/lib/service/listings";
import { Loader2 } from "lucide-react";
import { notFound, redirect, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckoutForm } from "./_components/checkout-form";
import { CheckoutSummary } from "./_components/checkout-summary";

export default async function CheckoutPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const slug = params.slug;

  if (!slug) {
    notFound();
  }

  const paymentSummaryData = await getListingById(slug);
  const bookedDates = await getBookedDates(slug);

  return (
    <div className="container mx-auto py-3 pb-12">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        <div className="lg:col-span-2 space-y-8">
          <Suspense fallback={<Loader2 />}>
            <CheckoutForm
              listingId={slug}
              universityId={paymentSummaryData?.universityId ?? undefined}
            />
          </Suspense>
        </div>

        <div className="lg:col-span-1">
          <Suspense fallback={<div>Loading summary...</div>}>
            <CheckoutSummary
              bookedDates={bookedDates}
              listing={paymentSummaryData}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
