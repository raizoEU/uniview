import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";

export function NoUpcomingBookings() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Card>
        <CardHeader>
          <CardTitle>No upcoming bookings</CardTitle>
          <CardDescription>
            You don't have any upcoming bookings right now.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Use our search feature to find the perfect accommodation.</p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/search">Find Accommodation</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
