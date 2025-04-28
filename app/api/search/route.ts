import { searchSchema } from "@/app/search/page";
import { db } from "@/lib/model";
import { listings, universities } from "@/lib/model/schema";
import { and, between, eq, ilike, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const location = searchParams.get("location");
    const universityId = searchParams.get("universityId");

    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "9");

    const validatedParams = searchSchema.parse({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      location: location || undefined,
      universityId: universityId || undefined,
      page,
      limit,
    });

    console.log("Search params:", validatedParams);

    const filters = [];

    if (validatedParams.startDate && validatedParams.endDate) {
      filters.push(
        between(
          listings.availableFrom,
          validatedParams.startDate,
          validatedParams.endDate
        )
      );
    }

    if (validatedParams.location) {
      console.log("Filtering by location:", validatedParams.location);
      filters.push(ilike(listings.location, `%${validatedParams.location}%`));
    }

    if (validatedParams.universityId) {
      filters.push(eq(listings.universityId, validatedParams.universityId));
    }

    const offset = (page - 1) * limit;

    const [total, searchResults] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(listings)
        .where(filters.length > 0 ? and(...filters) : undefined)
        .then((res) => Number(res[0].count)),

      db
        .select({
          id: listings.id,
          title: listings.title,
          description: listings.description,
          price: listings.price,
          location: listings.location,
          latitude: listings.latitude,
          longitude: listings.longitude,
          availableFrom: listings.availableFrom,
          isVerified: listings.isVerified,
          universityId: listings.universityId,
          hostId: listings.hostId,
          createdAt: listings.createdAt,
          imageUrl: sql<string>`(
            SELECT image_url FROM studentstay_property_images
            WHERE studentstay_property_images.listing_id = studentstay_listings.id
            LIMIT 1
          )`.as("imageUrl"),
          universityName: universities.name,
        })
        .from(listings)
        .leftJoin(universities, eq(listings.universityId, universities.id))
        .where(filters.length > 0 ? and(...filters) : undefined)
        .limit(limit)
        .offset(offset)
        .execute(),
    ]);

    const response = {
      items: searchResults,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
    console.log(
      `Search results for ${validatedParams.location}:`,
      searchResults
    );
    console.log("Response", response);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
