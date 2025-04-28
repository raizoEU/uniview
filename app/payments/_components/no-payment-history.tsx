import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export function NoPaymentHistory() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Card>
        <CardHeader>
          <CardTitle>No payment history</CardTitle>
          <CardDescription>
            You don't have any payment transactions yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Browse available accommodations to make your first booking.</p>
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