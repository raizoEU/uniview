ALTER TABLE "studentstay_bookings" ALTER COLUMN "status" SET DATA TYPE studentstay_booking_status;--> statement-breakpoint
ALTER TABLE "studentstay_payments" ALTER COLUMN "paymentMethod" SET DATA TYPE studentstay_payment_method;--> statement-breakpoint
ALTER TABLE "studentstay_payments" ALTER COLUMN "status" SET DATA TYPE studentstay_payment_status;