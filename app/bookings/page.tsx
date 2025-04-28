import { getBookings } from "@/lib/service/bookings";
import { BookingHistory } from "./_components/booking-history";
import { UnauthorizedError } from "@/lib/errors/errors";
import { redirect } from "next/navigation";

export default async function BookingsPage() {
  let bookingsData;

  try {
    bookingsData = await getBookings();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      console.error(error.message);
      redirect("/login");
    }
    console.error(error);
  }

  return (
    <div className="container mx-auto py-8">
      {bookingsData && <BookingHistory bookings={bookingsData} />}
    </div>
  );
}
