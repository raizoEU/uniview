import { studentstay_user } from "@/auth-schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/model";
import { bookings, listings, payments } from "@/lib/model/schema";
import { EarningsRow } from "@/lib/service/payments";
import { eq, sum } from "drizzle-orm";
import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import { Suspense } from "react";
import { EarningsLineChart } from "../../_components/earnings/earnings-chart";
import { EarningsTable } from "../../_components/earnings/earnings-table";
import { getSession } from "@/lib/service/get-session";

interface ChartData {
  month: string;
  amount: number;
}

async function getEarningsData(hostId?: string): Promise<EarningsRow[]> {
  if (!hostId) {
    console.error("Host ID is required");
    throw new Error("Host ID is required");
  }

  const results = await db
    .select({
      studentName: studentstay_user.name,
      studentEmail: studentstay_user.email,
      amount: sum(payments.amount),
      paymentStatus: payments.status,
      createdAt: payments.createdAt,
      listingTitle: listings.title,
    })
    .from(payments)
    .leftJoin(bookings, eq(payments.bookingId, bookings.id))
    .leftJoin(studentstay_user, eq(bookings.studentId, studentstay_user.id))
    .leftJoin(listings, eq(bookings.listingId, listings.id))
    .where(eq(listings.hostId, hostId))
    .groupBy(
      listings.title,
      studentstay_user.name,
      studentstay_user.email,
      payments.status,
      payments.createdAt
    );

  return results.map((earning) => ({
    studentName: earning.studentName ?? "Unknown Student",
    studentEmail: earning.studentEmail ?? "No Email",
    listingTitle: earning.listingTitle ?? "Unknown Listing",
    amount: earning.amount?.toString() ?? "0",
    status: earning.paymentStatus,
    createdAt: earning.createdAt ? new Date(earning.createdAt) : null,
  }));
}

export default async function HostDashboardEarnings() {
  const session = await getSession();
  const hostId = session?.user?.id;

  const earningsData: EarningsRow[] = await getEarningsData(hostId);

  const tableData = earningsData.map((earning) => ({
    studentName: earning.studentName,
    studentEmail: earning.studentEmail,
    amount: earning.amount || "0",
    status: earning.status,
    createdAt: earning.createdAt,
    listingTitle: earning.listingTitle,
  }));

  const chartData: ChartData[] = earningsData.map((earning) => {
    if (earning.createdAt) {
      const date = new Date(earning.createdAt);
      const month = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      return {
        month: month,
        amount: parseFloat(earning.amount),
      };
    } else {
      return { month: "Unknown", amount: 0 };
    }
  });

  return (
    <div className="space-y-4">
      <EarningsLineChart earningsData={chartData} />
      <Card>
        <CardHeader>
          <CardTitle>All Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <EarningsTable earningsData={tableData} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
