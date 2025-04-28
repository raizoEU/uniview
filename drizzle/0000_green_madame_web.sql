CREATE TABLE `studentstay_amenities` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`listing_id` bigint NOT NULL,
	`amenity` text NOT NULL,
	CONSTRAINT `studentstay_amenities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studentstay_blog_posts` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`slug` text NOT NULL,
	`type` text NOT NULL,
	`created_at` bigint NOT NULL,
	CONSTRAINT `studentstay_blog_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studentstay_bookings` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` bigint NOT NULL,
	`listing_id` bigint NOT NULL,
	`check_in` timestamp NOT NULL,
	`check_out` timestamp NOT NULL,
	`total_price` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `studentstay_bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studentstay_listings` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`price` bigint NOT NULL,
	`type` text NOT NULL,
	`address` text NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `studentstay_listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studentstay_reviews` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`listing_id` bigint NOT NULL,
	`user_id` bigint NOT NULL,
	`content` text NOT NULL,
	`rating` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `studentstay_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studentstay_users` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`user_type` text NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `studentstay_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `studentstay_users_email_unique` UNIQUE(`email`)
);
