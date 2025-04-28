import { auth } from "@/lib/auth";
import { db } from "@/lib/model";
import { bookings, listings, payments } from "@/lib/model/schema";
import { getSession } from "@/lib/service/get-session";
import { eq } from "drizzle-orm";
import { createUpdateSchema } from "drizzle-zod";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define the update schema using drizzle-zod
const updateBookingSchema = createUpdateSchema(bookings);

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = body.id;
    if (!id)
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );

    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the host owns the booking using a left join
    const booking = await db
      .select({ booking: bookings, listing: listings })
      .from(bookings)
      .leftJoin(listings, eq(bookings.listingId, listings.id))
      .where(eq(bookings.id, id))
      .limit(1);

    if (!booking.length || !booking[0].listing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Allow both the host and the tenant to update the booking
    const isHost = booking[0].listing.hostId === session.user.id;
    const isTenant = booking[0].booking.studentId === session.user.id;

    if (!isHost && !isTenant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate request body
    const parsedData = updateBookingSchema.parse(body);

    // If status is being updated to cancelled, update payment status as well
    if (parsedData.status === "cancelled") {
      await db
        .update(payments)
        .set({ status: "failed" })
        .where(eq(payments.bookingId, id));
    }

    // Update the booking
    const updated = await db
      .update(bookings)
      .set(parsedData)
      .where(eq(bookings.id, id))
      .returning();

    return NextResponse.json({ booking: updated[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof z.ZodError ? error.errors : "Internal Server Error",
      },
      { status: 400 }
    );
  }
}
