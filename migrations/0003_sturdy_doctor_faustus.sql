CREATE TABLE "studentstay_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid,
	"listing_id" uuid,
	"university_id" uuid,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" "booking_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "studentstay_host_profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"business_name" varchar(255),
	"tax_id" varchar(255),
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "studentstay_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"host_id" uuid,
	"university_id" uuid,
	"title" varchar(255) NOT NULL,
	"description" varchar NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"location" varchar(255) NOT NULL,
	"latitude" numeric(10, 7) NOT NULL,
	"longitude" numeric(10, 7) NOT NULL,
	"available_from" timestamp NOT NULL,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "studentstay_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "studentstay_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid,
	"student_id" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"paymentMethod" "payment_method" DEFAULT 'card',
	"status" "payment_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "studentstay_property_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid,
	"image_url" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "studentstay_saved_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid,
	"listing_id" uuid,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "studentstay_universities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"latitude" numeric(10, 7) NOT NULL,
	"longitude" numeric(10, 7) NOT NULL,
	"city" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "studentstay_bookings" ADD CONSTRAINT "studentstay_bookings_student_id_studentstay_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."studentstay_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentstay_bookings" ADD CONSTRAINT "studentstay_bookings_listing_id_studentstay_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."studentstay_listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentstay_bookings" ADD CONSTRAINT "studentstay_bookings_university_id_studentstay_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."studentstay_universities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentstay_host_profiles" ADD CONSTRAINT "studentstay_host_profiles_id_studentstay_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."studentstay_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentstay_listings" ADD CONSTRAINT "studentstay_listings_host_id_studentstay_user_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."studentstay_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentstay_listings" ADD CONSTRAINT "studentstay_listings_university_id_studentstay_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."studentstay_universities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentstay_notifications" ADD CONSTRAINT "studentstay_notifications_user_id_studentstay_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."studentstay_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentstay_payments" ADD CONSTRAINT "studentstay_payments_booking_id_studentstay_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."studentstay_bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentstay_payments" ADD CONSTRAINT "studentstay_payments_student_id_studentstay_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."studentstay_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentstay_property_images" ADD CONSTRAINT "studentstay_property_images_listing_id_studentstay_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."studentstay_listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentstay_saved_listings" ADD CONSTRAINT "studentstay_saved_listings_student_id_studentstay_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."studentstay_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentstay_saved_listings" ADD CONSTRAINT "studentstay_saved_listings_listing_id_studentstay_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."studentstay_listings"("id") ON DELETE no action ON UPDATE no action;