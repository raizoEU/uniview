ALTER TABLE "studentstay_bookings" DROP CONSTRAINT "studentstay_bookings_listing_id_studentstay_listings_id_fk";
--> statement-breakpoint
ALTER TABLE "studentstay_payments" DROP CONSTRAINT "studentstay_payments_booking_id_studentstay_bookings_id_fk";
--> statement-breakpoint
ALTER TABLE "studentstay_property_images" DROP CONSTRAINT "studentstay_property_images_listing_id_studentstay_listings_id_fk";
--> statement-breakpoint
ALTER TABLE "studentstay_saved_listings" DROP CONSTRAINT "studentstay_saved_listings_listing_id_studentstay_listings_id_fk";
--> statement-breakpoint
ALTER TABLE "studentstay_bookings" ADD CONSTRAINT "studentstay_bookings_listing_id_studentstay_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."studentstay_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentstay_payments" ADD CONSTRAINT "studentstay_payments_booking_id_studentstay_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."studentstay_bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentstay_property_images" ADD CONSTRAINT "studentstay_property_images_listing_id_studentstay_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."studentstay_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentstay_saved_listings" ADD CONSTRAINT "studentstay_saved_listings_listing_id_studentstay_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."studentstay_listings"("id") ON DELETE cascade ON UPDATE no action;