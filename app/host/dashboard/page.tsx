import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/model";
import { bookings, listings, payments } from "@/lib/model/schema";
import { getSession } from "@/lib/service/get-session";
import { cn } from "@/lib/utils";
import { and, count, eq } from "drizzle-orm";
import Link from "next/link";
import { z } from "zod";
import { BookingChart } from "./_components/booking-chart";
import { EarningsSummaryBarChart } from "./_components/earnings-summary-barchart";

export default async function HostDashboardPage() {
  const session = await getSession();
  const user = session?.user!;
  const hostId = user.id;

  // Fetch total bookings (for this host only)
  const totalBookingsResult = await db
    .select({
      count: count(bookings.id).as("count"),
    })
    .from(bookings)
    .innerJoin(listings, eq(bookings.listingId, listings.id))
    .where(eq(listings.hostId, hostId))
    .execute();

  const totalBookings = totalBookingsResult[0]?.count || 0;

  // Fetch pending bookings
  const pendingBookingsResult = await db
    .select({
      count: count(bookings.id).as("count"),
    })
    .from(bookings)
    .innerJoin(listings, eq(bookings.listingId, listings.id))
    .where(and(eq(listings.hostId, hostId), eq(bookings.status, "pending")))
    .execute();

  const pendingBookingsCount = pendingBookingsResult[0]?.count || 0;

  // Fetch monthly earnings
  async function getEarningsSummaryByMonth(
    hostId: string
  ): Promise<{ month: string; amount: number }[]> {
    const paymentsData = await db
      .select({
        createdAt: payments.createdAt,
        amount: payments.amount,
      })
      .from(payments)
      .innerJoin(bookings, eq(payments.bookingId, bookings.id))
      .innerJoin(listings, eq(bookings.listingId, listings.id))
      .where(eq(listings.hostId, hostId)) 
      .execute();

    // Aggregate earnings by month
    const earningsMap = new Map<string, number>();

    for (const payment of paymentsData) {
      if (!payment.createdAt) continue;
      const month = payment.createdAt.toISOString().slice(0, 7);
      const amount = parseFloat(payment.amount);

      earningsMap.set(month, (earningsMap.get(month) ?? 0) + amount);
    }

    return Array.from(earningsMap.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => b.month.localeCompare(a.month));
  }

  const monthlyEarningsResult = await getEarningsSummaryByMonth(hostId);

  return (
    <main className="flex flex-col gap-8 h-full mb-12">
      <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
        Welcome {user.name}!
      </h1>
      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="md:grow h-full flex flex-col">
          <CardHeader>
            <CardTitle>Earnings</CardTitle>
            <CardDescription>
              <p>
                Earnings are calculated based on the bookings you have received
              </p>
              <Link
                href="/host/dashboard/earnings"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "mt-3 w-fit p-0"
                )}
              >
                View Detailed Earnings
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="grow">
            <div className="mt-4">
              <EarningsSummaryBarChart data={monthlyEarningsResult} />
            </div>
          </CardContent>
        </Card>
        <Card className="md:flex flex-col">
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription className="flex flex-col">
              <p>Students that have booked your listings</p>
              <Link
                href="/host/dashboard/bookings"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "p-0 w-fit mt-3"
                )}
              >
                View All Bookings
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="md:grow">
            <BookingChart
              pendingBookings={pendingBookingsCount}
              confirmedBookings={totalBookings - pendingBookingsCount}
            />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Listings</CardTitle>
          <CardDescription>
            Your homes that you are renting out to students
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-3">
          <Link
            href="/host/dashboard/create-listing"
            className={buttonVariants({ variant: "outline" })}
          >
            Create Listing
          </Link>
          <Link
            href="/host/dashboard/my-listings"
            className={buttonVariants({ variant: "outline" })}
          >
            View All Listings
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
