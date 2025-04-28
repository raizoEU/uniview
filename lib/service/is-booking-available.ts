"server only";

import { db } from "../model";
import { and, lte, gte, eq, notInArray } from "drizzle-orm";
import { bookings } from "@/lib/model/schema";
import { ServerError } from "../errors/errors";

/**
 * Checks if a listing is available for a new booking within a given date range.
 * @param listingId - The ID of the listing to check.
 * @param startDate - The desired booking start date.
 * @param endDate - The desired booking end date.
 * @returns `true` if available, `false` if there is a conflicting booking.
 */
export async function isBookingAvailable(
  listingId: string,
  startDate: Date,
  endDate: Date
): Promise<boolean> {
  if (!listingId || !startDate || !endDate) {
    throw new ServerError("BadRequest", "Missing required parameters.");
  }

  const conflictingBooking = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(
      and(
        eq(bookings.listingId, listingId), // Only check bookings for the same listing
        lte(bookings.startDate, endDate), // Booking starts before or on desired end date
        gte(bookings.endDate, startDate), // Booking ends after or on desired start date
        notInArray(bookings.status, ["cancelled", "completed"]) // Ignore cancelled/completed bookings
      )
    )
    .limit(1);

  return conflictingBooking.length === 0; // `true` if available, `false` if conflict exists
}
