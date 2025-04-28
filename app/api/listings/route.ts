import { db } from "@/lib/model";
import { listings, propertyImages } from "@/lib/model/schema";
import { getSession } from "@/lib/service/get-session";
import { createListingSchema } from "@/lib/validation/schemas";
import { eq } from "drizzle-orm";
import { createUpdateSchema } from "drizzle-zod";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Raw body data:", body);

    const convertToGoodData = {
      id: crypto.randomUUID(),
      hostId: session.user.id,
      title: body.title,
      description: body.description,
      price: String(body.price),
      location: body.location || "",
      latitude: String(body.latitude),
      longitude: String(body.longitude),
      availableFrom: new Date(body.availableFrom),
      isVerified: body.isVerified,
      universityId: body.universityId,
    };

    console.log("Good data:", convertToGoodData);

    const data = createListingSchema.parse(convertToGoodData);

    await db.insert(listings).values(data);

    return NextResponse.json(
      { success: true, data: { id: data.id } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating listing:", error);
    if (error instanceof ZodError) {
      console.error(error.issues.map((issue) => issue.path));
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

const editListingSchema = createUpdateSchema(listings);

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const parsedData = editListingSchema.parse({
      ...body,
      price: String(body.price),
      availableFrom: new Date(body.availableFrom),
    });

    await db.update(listings).set(parsedData).where(eq(listings.id, body.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating listing:", error);
    if (error instanceof ZodError) {
      console.error(error.issues.map((issue) => issue.path));
    }
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { listingId } = await req.json();

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Get images associated with the listing
    const images = await db
      .select({ url: propertyImages.imageUrl })
      .from(propertyImages)
      .where(eq(propertyImages.listingId, listingId));

    // Extract UploadThing file keys
    const fileKeys = images
      .map((image) => image.url.split("/f/")[1])
      .filter(Boolean);

    // Delete images from UploadThing
    if (fileKeys.length > 0) {
      await new UTApi().deleteFiles(fileKeys);
    }

    // Delete the listing
    await db.delete(listings).where(eq(listings.id, listingId));

    return NextResponse.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
