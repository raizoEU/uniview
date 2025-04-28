import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

export function NoSavedListings() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">
        You haven't saved any listings yet.
      </h1>
      <p className="text-muted-foreground">
        Save your favorite properties for future reference.
      </p>
      <Button variant="outline" className="w-fit" asChild>
        <Link href="/search">
          <Search className="mr-2 h-4 w-4" />
          Explore listings
        </Link>
      </Button>
    </div>
  );
}
