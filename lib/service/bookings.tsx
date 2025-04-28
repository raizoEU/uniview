"server only";

import { eq } from "drizzle-orm";
import { ServerError, UnauthorizedError } from "../errors/errors";
import { db } from "../model";
import { bookings, payments } from "../model/schema";
import { getSession } from "./get-session";
import { isBookingAvailable } from "./is-booking-available";

export const getBookings = async () => {
  const session = await getSession();
  if (!session) {
    throw new UnauthorizedError();
  }

  return await db.query.bookings.findMany({
    where: (bookings, { eq }) => eq(bookings.studentId, session.user.id),
    with: {
      listing: {
        with: {
          university: true,
          user: {
            with: {
              hostProfiles: {
                limit: 1,
              },
            },
          },
        },
      },
    },
  });
};

export async function getBookedDates(listingId: string) {
  const bookedRanges = await db
    .select({
      startDate: bookings.startDate,
      endDate: bookings.endDate,
    })
    .from(bookings)
    .where(eq(bookings.listingId, listingId));

  return bookedRanges;
}

// Calculate total months and cost
const calculateTotalMonths = (startDate: Date, endDate: Date) => {
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

/**
 * Creates a new booking if the listing is available.
 * @param userId - The ID of the student booking the listing.
 * @param listingId - The ID of the listing.
 * @param universityId - The ID of the university associated with the booking.
 * @param startDate - The booking start date.
 * @param endDate - The booking end date.
 * @returns The created booking ID if successful, `null` if unavailable.
 */
export async function createBooking(
  listingId: string,
  universityId: string | null,
  startDate: Date,
  endDate: Date
): Promise<string | null> {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();

  const userId = session.user.id;

  // Check if user is a host
  const userProfile = await db.query.studentstay_user.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
    columns: {
      role: true,
    },
  });

  if (!userProfile || userProfile.role === "host") {
    console.error("Hosts cannot make bookings");
    return null;
  }

  // Check if user owns the listing
  const listing = await db.query.listings.findFirst({
    where: (listings, { eq }) => eq(listings.id, listingId),
    columns: {
      hostId: true,
      price: true,
    },
  });

  if (!listing) throw new ServerError("NotFound", "Listing not found");

  if (listing.hostId === userId) {
    console.error("Users cannot book their own listings");
    return null;
  }

  // Check availability
  const isAvailable = await isBookingAvailable(listingId, startDate, endDate);
  if (!isAvailable) return null; // Booking cannot be created

  const totalMonths = calculateTotalMonths(startDate, endDate);
  const totalAmount = Number(listing.price) * totalMonths;
  try {
    // Create the booking first
    const [newBooking] = await db
      .insert(bookings)
      .values({
        id: crypto.randomUUID(),
        studentId: userId,
        listingId,
        universityId,
        startDate,
        endDate,
        status: "pending",
      })
      .returning();

    if (!newBooking)
      throw new ServerError("BadRequest", "Failed to create booking");

    // Create the payment
    const [newPayment] = await db
      .insert(payments)
      .values({
        id: crypto.randomUUID(),
        bookingId: newBooking.id,
        studentId: userId,
        amount: `${totalAmount}`,
        status: "pending",
      })
      .returning();

    if (!newPayment) {
      // If payment creation fails, delete the booking
      await db.delete(bookings).where(eq(bookings.id, newBooking.id));
      throw new ServerError("BadRequest", "Failed to create payment");
    }

    return newBooking.id;
  } catch (error) {
    console.error("Error creating booking:", error);
    return null;
  }
}
