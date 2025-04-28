import { ListingCard } from "@/components/listing-card";
import { ResponsiveGridCardsSkeleton } from "@/components/skeletons/responsive-grid-cards-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFeaturedListings } from "@/lib/service/featured-listings";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  const featuredListings = await getFeaturedListings();

  return (
    <main className="container mx-auto py-36">
      <div>
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Find Your{" "}
            <span
              className={cn(
                "bg-secondary text-secondary-foreground p-1.5 px-2 font-extrabold"
              )}
            >
              Perfect
            </span>{" "}
            Student Accommodation
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover comfortable and affordable places to stay near your
            university
          </p>
          <Link
            href="/search"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            Search Now
          </Link>
        </section>

        {/* Featured Listings */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Featured Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Suspense fallback={<ResponsiveGridCardsSkeleton />}>
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </Suspense>
          </div>
        </section>

        {/* How it Works */}
        <section className="mb-16 bg-secondary p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Search",
                description:
                  "Find the perfect accommodation that fits your needs.",
              },
              {
                title: "Book",
                description: "Secure your stay with our easy booking process.",
              },
              {
                title: "Stay",
                description: "Enjoy your new home away from home!",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            What Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <p className="italic mb-4">
                  "Found my dream apartment for my exchange semester. Highly
                  recommend!"
                </p>
                <div className="flex items-center">
                  <img
                    src="https://i.pravatar.cc/100?img=1"
                    alt="Sarah"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">Sarah</p>
                    <p className="text-sm text-muted-foreground">
                      Exchange Student
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="italic mb-4">
                  "Quick and easy booking process. Great customer service!"
                </p>
                <div className="flex items-center">
                  <img
                    src="https://i.pravatar.cc/100?img=2"
                    alt="Tom"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">Tom</p>
                    <p className="text-sm text-muted-foreground">
                      Postgraduate Student
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
