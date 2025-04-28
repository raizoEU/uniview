import { studentstay_user } from "@/auth-schema";
import { eq, sum } from "drizzle-orm";
import { db } from "../model";
import { bookings, listings, payments } from "../model/schema";
import { Listings, Payments, Students } from "../model/types";

export interface EarningsRow {
  studentName: Students["name"];
  studentEmail: Students["email"];
  amount: Payments["amount"];
  status: Payments["status"];
  createdAt: Payments["createdAt"];
  listingTitle: Listings["title"];
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
