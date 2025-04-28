import { studentstay_user } from "@/auth-schema";
import { db } from "@/lib/model";
import { listings, propertyImages } from "@/lib/model/schema";
import { getSession } from "@/lib/service/get-session";
import { eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  })
    .input(z.object({ listingId: z.string() }))
    .middleware(async ({ req, input }) => {
      const session = await getSession();
      // Check if there is a valid session
      if (!session) {
        throw new UploadThingError("Unauthorized");
      }

      // Check if the listing belongs to the user
      const listingsQuery = await db
        .select()
        .from(listings)
        .where(eq(listings.id, input.listingId));

      if (listingsQuery[0]?.hostId !== session.user.id) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: session.user.id, listingId: input.listingId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // Insert the image into the database
        await db.insert(propertyImages).values({
          id: crypto.randomUUID(),
          listingId: metadata.listingId,
          createdAt: new Date(),
          imageUrl: file.ufsUrl,
        });
        return { uploadedBy: metadata.userId };
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        throw new UploadThingError("Unexpected error occurred");
      }
    }),
  avatarUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  })
    .middleware(async ({ req, input }) => {
      const session = await getSession();
      // Check if there is a valid session
      if (!session) {
        throw new UploadThingError("Unauthorized");
      }

      // Get old image associated with the user
      const oldImage = session.user.image;

      return { userId: session.user.id, oldImage };
    })
    .onUploadComplete(async ({ req, metadata, file }) => {
      try {
        const utApi = new UTApi();
        if (metadata.oldImage) {
          // Regex to check for a valid UploadThing URL format
          const fileKey = metadata.oldImage.split("/f/")[1];

          // Check if the oldImage URL matches the expected pattern. It might be good to add a regex here.
          // TODO: Add a regex to check for a valid UploadThing URL format (or store file keys in the database)
          if (fileKey.length > 0) {
            // Proceed to delete the file if the fileKey is valid
            await utApi.deleteFiles([fileKey]);
          } else {
            console.log("Invalid URL format:", metadata.oldImage);
            throw new UploadThingError("Invalid URL format");
          }
        }

        await db
          .update(studentstay_user)
          .set({ image: file.ufsUrl })
          .where(eq(studentstay_user.id, metadata.userId));
        return { uploadedBy: metadata.userId, ufsUrl: file.ufsUrl };
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        throw new UploadThingError("Unexpected error occurred");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
