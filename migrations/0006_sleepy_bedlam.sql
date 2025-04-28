CREATE TYPE "public"."studentstay_booking_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."studentstay_payment_method" AS ENUM('card', 'paypal', 'bank-transfer');--> statement-breakpoint
CREATE TYPE "public"."studentstay_payment_status" AS ENUM('pending', 'successful', 'failed');