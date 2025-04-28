import { studentstay_user } from "@/auth-schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/model";
import {
  bookings,
  listings,
  payments,
  propertyImages,
  universities,
} from "@/lib/model/schema";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import {
  BadgePoundSterling,
  Clock,
  GraduationCap,
  Home,
  Library,
  Moon,
  School,
  Sun,
} from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DisplayInformation } from "../../../_components/display-information";
import { getSession } from "@/lib/service/get-session";

interface BookingDetails {
  id: string;
  property: string | null;
  tenantName: string | null;
  startDate: Date;
  endDate: Date;
  paymentAmount: number | null;
  tenantEmail: string | null;
  tenantId: string | null;

  paymentStatus: string | null;
  bookingStatus: string | null;
  university: string | null;
  createdAt: Date;
  propertyImage: string | null;
}

export default async function BookingDetailsPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const session = await getSession();
  const userId = session?.user?.id;

  const bookingDetails = await db
    .select({
      id: bookings.id,
      property: listings.title,
      tenantName: studentstay_user.name,
      tenantEmail: studentstay_user.email,
      tenantId: studentstay_user.id,
      startDate: bookings.startDate,
      endDate: bookings.endDate,
      paymentAmount: payments.amount,
      paymentStatus: payments.status,
      bookingStatus: bookings.status,
      university: universities.name,
      createdAt: bookings.createdAt,
      propertyImage: propertyImages.imageUrl,
    })
    .from(bookings)
    .leftJoin(listings, eq(bookings.listingId, listings.id))
    .leftJoin(payments, eq(bookings.id, payments.bookingId))
    .leftJoin(studentstay_user, eq(bookings.studentId, studentstay_user.id))
    .leftJoin(propertyImages, eq(listings.id, propertyImages.listingId))
    .leftJoin(universities, eq(bookings.universityId, universities.id)) // Join for university name
    .where(eq(bookings.id, slug))
    .execute();

  if (!bookingDetails.length) {
    return <p>Booking not found.</p>;
  }

  const booking = bookingDetails[0] as BookingDetails;

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="cols-span-1">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{booking.property}</CardTitle>
            <Button variant="destructive">Cancel Booking</Button>
          </div>
        </CardHeader>
        <CardContent className="h-full">
          <div className="h-[300px] w-full relative overflow-hidden rounded-lg">
            {booking.propertyImage && (
              <Image
                src={booking.propertyImage}
                alt={`Image of ${booking.property}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                loading="eager"
              />
            )}
          </div>
        </CardContent>
      </Card>
      <div className="space-y-3">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Payment</CardTitle>
              <Badge
                variant={
                  booking.paymentStatus === "failed" ? "destructive" : "default"
                }
              >
                {booking.paymentStatus || "N/A"}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter>
            <div>£{booking.paymentAmount}</div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Booking</CardTitle>
              <Badge
                variant={
                  booking.bookingStatus === "failed" ? "destructive" : "default"
                }
              >
                {booking.bookingStatus || "N/A"}
              </Badge>
            </div>
            <CardDescription>Booking ID: {booking.id}</CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <DisplayInformation
              title="Student Details"
              icon={<GraduationCap className="h-4 w-4" />}
            >
              <p>{booking.tenantName}</p>
              <p>{booking.tenantEmail}</p>
            </DisplayInformation>

            <DisplayInformation
              title="Listing Details"
              icon={<Home className="h-4 w-4" />}
            >
              <p>{booking.property}</p>
            </DisplayInformation>

            <DisplayInformation
              title="Dates"
              icon={<Clock className="h-4 w-4" />}
            >
              <p>
                Booked on {new Date(booking.createdAt).toLocaleDateString()}
              </p>
              <p>Moves in {new Date(booking.startDate).toLocaleDateString()}</p>
              <p>Moves out {new Date(booking.endDate).toLocaleDateString()}</p>
            </DisplayInformation>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
