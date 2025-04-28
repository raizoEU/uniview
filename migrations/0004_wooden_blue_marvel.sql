ALTER TABLE "studentstay_bookings" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_bookings" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "studentstay_bookings" ALTER COLUMN "student_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_bookings" ALTER COLUMN "listing_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_bookings" ALTER COLUMN "university_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_host_profiles" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_listings" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_listings" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "studentstay_listings" ALTER COLUMN "host_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_listings" ALTER COLUMN "university_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_notifications" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_notifications" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "studentstay_notifications" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_payments" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_payments" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "studentstay_payments" ALTER COLUMN "booking_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_payments" ALTER COLUMN "student_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_property_images" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_property_images" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "studentstay_property_images" ALTER COLUMN "listing_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_saved_listings" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_saved_listings" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "studentstay_saved_listings" ALTER COLUMN "student_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_saved_listings" ALTER COLUMN "listing_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_universities" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "studentstay_universities" ALTER COLUMN "id" DROP DEFAULT;