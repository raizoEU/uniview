CREATE TABLE "studentstay_reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text,
	"user_id" text,
	"rating" numeric(2, 1) NOT NULL,
	"review" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "studentstay_reviews" ADD CONSTRAINT "studentstay_reviews_listing_id_studentstay_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."studentstay_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentstay_reviews" ADD CONSTRAINT "studentstay_reviews_user_id_studentstay_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."studentstay_user"("id") ON DELETE no action ON UPDATE no action;