import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/model";
import { listings, universities } from "@/lib/model/schema";
import { cn } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

// TODO: Some middleware to check if the listing exists, if the listing belongs to the user, and use is host.

export default async function CreateListingSuccessPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  if (!slug) {
    return redirect("/host/dashboard/create-listing");
  }

  const listingQuery = await db
    .select()
    .from(listings)
    .where(eq(listings.id, slug));

  if (!listingQuery.length) {
    return notFound();
  }

  const listing = listingQuery[0];
  const universityQuery = await db
    .select()
    .from(universities)
    .where(eq(universities.id, listing.universityId!));
  const university = universityQuery[0];

  return (
    <main className="container mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
          You have successfully created a listing for {listing.title}!
        </h1>
        <p className="text-muted-foreground">
          To add images, or edit your listing, please refer to your listing
          page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{listing.title}</CardTitle>
          <CardDescription>{listing.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>£{listing.price}</p>
          <p>{listing.location ?? "No location listed"}</p>
          <p>{university.name ?? "No university selected"}</p>
          <p>Available from {listing.availableFrom.toLocaleDateString()}</p>
          <p>{listing.isVerified ? "Verified" : "Under Review"}</p>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2 items-center">
            <Link
              className={cn(buttonVariants({ variant: "default" }), "h-full")}
              href={`/host/dashboard/my-listings/${slug}`}
            >
              <ArrowRight /> View Listing Page
            </Link>
            <Link
              className={cn(buttonVariants({ variant: "outline" }), "h-full")}
              href={`/host/dashboard/create-listing`}
            >
              <Plus /> Create another listing
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
