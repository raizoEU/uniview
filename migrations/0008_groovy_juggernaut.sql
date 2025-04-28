CREATE TABLE "studentstay_student_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"biography" varchar NOT NULL,
	"phone_number" varchar(20)
);
--> statement-breakpoint
ALTER TABLE "studentstay_host_profiles" ADD COLUMN "biography" varchar;--> statement-breakpoint
ALTER TABLE "studentstay_host_profiles" ADD COLUMN "phone_number" varchar(20);--> statement-breakpoint
ALTER TABLE "studentstay_student_profiles" ADD CONSTRAINT "studentstay_student_profiles_id_studentstay_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."studentstay_user"("id") ON DELETE no action ON UPDATE no action;