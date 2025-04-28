import { BadRequestError, UnauthorizedError } from "@/lib/errors/errors";
import { createBooking } from "@/lib/service/bookings";
import { getSession } from "@/lib/service/get-session";
import { createBookingSchema } from "@/lib/validation/schemas";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("[Booking API] Received booking request");

    // Check authentication
    const session = await getSession();
    if (!session) {
      console.log("[Booking API] Authentication failed: No session found");
      throw new UnauthorizedError();
    }
    console.log("[Booking API] Authentication successful");

    // Parse and validate request body
    const body = await request.json();
    console.log("[Booking API] Request body:", body);

    const validatedData = createBookingSchema.parse(body);
    console.log("[Booking API] Validation successful:", validatedData);

    if (!validatedData.startDate || !validatedData.endDate) {
      console.log("[Booking API] Validation failed: Missing dates");
      throw new BadRequestError("Missing dates");
    }

    // Create booking
    console.log("[Booking API] Attempting to create booking...");
    const bookingId = await createBooking(
      validatedData.listingId,
      validatedData.universityId || null,
      new Date(validatedData.startDate),
      new Date(validatedData.endDate)
    );

    if (!bookingId) {
      console.log("[Booking API] Booking creation failed: Conflicting dates");
      throw new BadRequestError(
        "Conflicting dates found when creating booking."
      );
    }

    console.log("[Booking API] Booking created successfully:", bookingId);
    return new NextResponse(
      JSON.stringify({
        id: bookingId,
      }),
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      console.log("[Booking API] Error: Unauthorized request");
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
        }),
        { status: 401 }
      );
    }

    if (error instanceof BadRequestError) {
      console.log("[Booking API] Error: Bad request -", error.message);
      return new NextResponse(
        JSON.stringify({
          error: error.message,
        }),
        { status: 400 }
      );
    }

    console.error("[Booking API] Unexpected error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal server error",
      }),
      { status: 500 }
    );
  }
}
