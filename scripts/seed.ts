import { db } from "@/lib/model";
import {
  bookings,
  hostProfiles,
  listings,
  payments,
  propertyImages,
  savedListings,
  universities,
} from "@/lib/model/schema";
import { UTApi } from "uploadthing/server";
import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";

const HOST_ID = "H7x6TUDT1aRh7euLkOjkJfj9mHECzWTa";

async function deleteUploadThingImages() {
  console.log("🗑️ Deleting images from UploadThing...");

  // Fetch all image URLs from propertyImages
  const images = await db
    .select({ url: propertyImages.imageUrl })
    .from(propertyImages);

  // Extract UploadThing file keys
  const fileKeys = images
    .map((image) => image.url.split("/f/")[1])
    .filter(Boolean);

  // Delete images from UploadThing
  if (fileKeys.length > 0) {
    try {
      await new UTApi().deleteFiles(fileKeys);
      console.log(`✅ Deleted ${fileKeys.length} images from UploadThing.`);
    } catch (error) {
      console.error("❌ Failed to delete images from UploadThing:", error);
    }
  }
}

// ! This file can only be run after the database has been created. Run `npm run db:push` first.
// ! This script deletes all previous data from the database.

/**
 * Seed function that will delete all data from the database and re-seed it with new, placeholder data.
 * It will also delete all images from UploadThing.
 * This data is to mimick a real-world scenario where users can create listings, book rooms, and make payments.
 *
 * This file can be run as npm run db:seed
 */
async function seed() {
  console.log("🌱 Starting database seed...");

  await deleteUploadThingImages();

  console.log("🗑️ Deleting all data from the database...");
  await db.delete(payments);
  await db.delete(bookings);
  await db.delete(savedListings);
  await db.delete(propertyImages);
  await db.delete(listings);
  await db.delete(hostProfiles);
  await db.delete(universities);

  // Seed host profile: this is the user who will create listings, and manage bookings and payments
  console.log("🏠 Seeding host profile...");
  await db.insert(hostProfiles).values({
    id: HOST_ID,
    businessName: faker.company.name(),
    verified: true,
  });

  // Seed universities: these are universities that listings can (optionally) be associated with
  // They will be used to filter listings based on their associated university
  console.log("🎓 Seeding universities...");
  const universityRecords = [
    { name: "Oxford University", city: "Oxford" },
    { name: "Cambridge University", city: "Cambridge" },
    { name: "Harvard University", city: "Boston" },
  ].map((uni) => ({
    id: faker.string.uuid(),
    name: uni.name,
    latitude: faker.location.latitude().toString(),
    longitude: faker.location.longitude().toString(),
    city: uni.city,
  }));

  const universitiesData = await db
    .insert(universities)
    .values(universityRecords)
    .returning();
  const universityIds = universitiesData.map((uni) => uni.id);

  // Seed listings: these are the listings that host users can create and manage
  // They will be associated with a university, and have a price, location, and description
  console.log("🏡 Seeding listings...");
  const listingNames = [
    "Blueberry House",
    "Maple Leaf Lodge",
    "Sunset View Apartments",
  ];

  const listingsRecords = Array.from({ length: listingNames.length }).map(
    (_, index) => ({
      id: faker.string.uuid(),
      hostId: HOST_ID,
      universityId: faker.helpers.arrayElement(universityIds),
      title: listingNames[index],
      description: faker.lorem.sentence(),
      price: faker.number
        .float({ min: 500, max: 2000, fractionDigits: 2 })
        .toFixed(2),
      location: faker.location.streetAddress(),
      latitude: faker.location.latitude().toString(),
      longitude: faker.location.longitude().toString(),
      availableFrom: faker.date.future(),
      isVerified: faker.datatype.boolean(),
    })
  );

  const listingsData = await db
    .insert(listings)
    .values(listingsRecords)
    .returning();

  // Seed property images: these are the images that will be associated with each listing
  // For now, we're just using random images from picsum.photos
  // However, in a real-world scenario, these images would be uploaded by the host user
  console.log("🖼️ Seeding property images...");
  const imageRecords = listingsData.flatMap((listing) =>
    Array.from({ length: 3 }).map(() => ({
      id: faker.string.uuid(),
      listingId: listing.id,
      imageUrl: `https://picsum.photos/seed/${faker.string.uuid()}/500/300`,
    }))
  );

  await db.insert(propertyImages).values(imageRecords);

  // Seed bookings: these are the bookings that students can make on a listing
  // They will be associated with a listing, and have a start and end date
  console.log("📅 Seeding bookings...");
  const students = await db.query.studentstay_user.findMany({
    where: (user) => eq(user.role, "student"),
  });

  const bookingRecords = listingsData.map((listing) => {
    const randomStudent = faker.helpers.arrayElement(students);
    return {
      id: faker.string.uuid(),
      studentId: randomStudent.id,
      listingId: listing.id,
      universityId: listing.universityId,
      startDate: faker.date.future(),
      endDate: faker.date.future(),
      status: faker.helpers.arrayElement([
        "pending",
        "confirmed",
        "cancelled",
        "completed",
      ]),
    };
  });

  const bookingsData = await db
    .insert(bookings)
    .values(bookingRecords)
    .returning();

  // Seed payments: these are the payments that students can make on a booking
  // They will be associated with a booking, and have a payment method and status
  console.log("💳 Seeding payments...");
  const paymentStatuses = ["pending", "successful", "failed"] as const;
  const paymentMethods = ["card", "paypal", "bank-transfer"] as const;

  const paymentRecords = bookingsData.map((booking) => {
    const listing = listingsData.find((l) => l.id === booking.listingId);
    const amount = listing ? parseFloat(listing.price) : 1000;

    return {
      id: faker.string.uuid(),
      bookingId: booking.id,
      studentId: booking.studentId!,
      amount: amount.toFixed(2),
      paymentMethod: faker.helpers.arrayElement(paymentMethods),
      status: faker.helpers.arrayElement(paymentStatuses),
    };
  });

  await db.insert(payments).values(paymentRecords);

  console.log("✅ Seeding complete!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Seed failed", error);
    process.exit(1);
  });
