import { SearchForm } from "@/app/search/_components/search-form";
import { db } from "@/lib/model";
import { universities } from "@/lib/model/schema";
import { z } from "zod";
import { SearchResults } from "./_components/search-results";

export const searchSchema = z
  .object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    location: z.string().optional(),
    universityId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate && !data.endDate) {
        return true;
      }
      // Check if start date is before end date - reject
      if (data.startDate && data.endDate && data.startDate > data.endDate) {
        return false;
      }
      // Check if start date is the same as end date - reject
      if (data.startDate === data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "Start date must be before end date",
      path: ["endDate"],
    }
  );

export default async function SearchPage() {
  const uniQuery = await db.select().from(universities).execute();

  return (
    <main className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Search Listings</h1>
      <SearchForm uniQuery={uniQuery} />
      <SearchResults />
    </main>
  );
}

export const dynamic = "force-dynamic";
