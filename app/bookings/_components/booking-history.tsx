"use client";

import { CheckCircleIcon, ClockIcon, XCircleIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubmission } from "@/hooks/use-submission";
import {
  Bookings,
  HostProfiles,
  Listings,
  Universities,
  User,
} from "@/lib/model/types";
import { NoPastBookings } from "./no-past-bookings";
import { NoUpcomingBookings } from "./no-upcoming-bookings";

type ListingsWithUniversityAndHost = Listings & {
  university: Universities | null;
  user: (User & { hostProfiles: HostProfiles[] }) | null;
};

type BookingsWithListings = Bookings & {
  listing: ListingsWithUniversityAndHost | null;
};
interface BookingHistoryProps {
  bookings: BookingsWithListings[];
}

export function BookingHistory({
  bookings: bookingsData,
}: BookingHistoryProps) {
  const { execute: cancelBooking, isLoading: isCancelling } = useSubmission({
    action: async (bookingId: string) =>
      fetch(`/api/booking`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: bookingId, status: "cancelled" }),
      }),
    successMessage: "Booking cancelled successfully",
    errorMessage: "Failed to cancel booking",
    loadingMessage: "Cancelling booking...",
  });

  const handleCancelBooking = async (bookingId: string) => {
    await cancelBooking(bookingId);
  };

  const upcomingBookings = bookingsData.filter(
    (booking) => booking.status === "confirmed" || booking.status === "pending"
  );
  const pastBookings = bookingsData.filter(
    (booking) =>
      booking.status === "completed" || booking.status === "cancelled"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Booking History</h1>
        <p className="text-muted-foreground">
          View and manage your past and upcoming accommodation bookings.
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
          <TabsTrigger value="past">Past Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <NoUpcomingBookings />
          ) : (
            upcomingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle>{booking.listing?.title}</CardTitle>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Location
                      </div>
                      <div>{booking.listing?.location}</div>
                      <div className="text-sm text-muted-foreground mt-2">
                        University
                      </div>
                      <div>{booking.listing?.university?.name}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Stay Period
                      </div>
                      <div>
                        {booking.startDate.toLocaleDateString()} -{" "}
                        {booking.endDate.toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Host
                      </div>
                      <div>
                        {booking.listing?.user?.hostProfiles?.[0]?.businessName}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
                    <div className="font-semibold">
                      ${Number(booking.listing?.price).toFixed(2)}
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        / month
                      </span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      {booking.status === "pending" && (
                        <Button
                          variant="outline"
                          className="flex-1 sm:flex-initial"
                          onClick={() => handleCancelBooking(booking.id)}
                          loading={isCancelling}
                          disabled={isCancelling}
                        >
                          Cancel
                        </Button>
                      )}
                      {/* <Button
                        variant="outline"
                        className="flex-1 sm:flex-initial h-full"
                      >
                        View Details
                      </Button> */}
                      {/* <Button className="flex-1 sm:flex-initial h-full">
                        Contact Host
                      </Button> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings.length === 0 ? (
            <NoPastBookings />
          ) : (
            pastBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle>{booking.listing?.title}</CardTitle>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Location
                      </div>
                      <div>{booking.listing?.location}</div>
                      <div className="text-sm text-muted-foreground mt-2">
                        University
                      </div>
                      <div>{booking.listing?.university?.name}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Stay Period
                      </div>
                      <div>
                        {booking.startDate.toLocaleDateString()} -{" "}
                        {booking.endDate.toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Host
                      </div>
                      <div>
                        {booking.listing?.user?.hostProfiles?.[0]?.businessName}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
                    <div className="font-semibold">
                      ${Number(booking.listing?.price).toFixed(2)}
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        / month
                      </span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      {booking.status === "completed" && (
                        <Button
                          variant="outline"
                          className="flex-1 sm:flex-initial"
                        >
                          Leave Review
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="flex-1 sm:flex-initial"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to get status badge
function getStatusBadge(status: string | null) {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="bg-green-500">
          <CheckCircleIcon className="mr-1 h-3 w-3" />
          Confirmed
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="text-amber-500 border-amber-500">
          <ClockIcon className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="outline" className="text-red-500 border-red-500">
          <XCircleIcon className="mr-1 h-3 w-3" />
          Cancelled
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="text-green-500 border-green-500">
          <CheckCircleIcon className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
