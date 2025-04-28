import { studentstay_user } from "@/auth-schema";
import { db } from "@/lib/model";
import { bookings, listings } from "@/lib/model/schema";
import { getSession } from "@/lib/service/get-session";
import { eq } from "drizzle-orm";
import BookingTable from "../../_components/bookings/bookings-table";

export default async function HostDashboardBookings() {
  const session = await getSession();
  const hostId = session?.user?.id;

  const hostBookings = await db
    .select({
      id: bookings.id,
      property: listings.title,
      tenantName: studentstay_user.name,
      startDate: bookings.startDate,
      endDate: bookings.endDate,
      bookingStatus: bookings.status,
    })
    .from(bookings)
    .leftJoin(listings, eq(bookings.listingId, listings.id))
    .leftJoin(studentstay_user, eq(bookings.studentId, studentstay_user.id))
    .where(eq(listings.hostId, hostId));

  return (
    <>
      {hostBookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <BookingTable bookings={hostBookings} />
      )}
    </>
  );
}
