"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default function BookingEntryDropdown({
  booking,
  handleAcceptBooking,
  handleCancelBooking,
}: {
  booking: any;
  handleAcceptBooking: () => void;
  handleCancelBooking: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        {booking.bookingStatus === "pending" && (
          <DropdownMenuItem onClick={handleAcceptBooking}>
            Accept Booking
          </DropdownMenuItem>
        )}
        {booking.bookingStatus === "confirmed" && (
          <DropdownMenuItem onClick={handleCancelBooking}>
            Cancel Booking
          </DropdownMenuItem>
        )}

        {booking.bookingStatus === "pending" ||
          (booking.bookingStatus === "confirmed" && <DropdownMenuSeparator />)}

        <DropdownMenuItem asChild>
          <Link href={`/host/dashboard/bookings/${booking.id}`}>
            View Details
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
