ALTER TABLE `studentstay_users` CHANGE `name` `first_name`;--> statement-breakpoint
ALTER TABLE `studentstay_users` ADD CONSTRAINT `studentstay_users_id_unique` UNIQUE(`id`);--> statement-breakpoint
ALTER TABLE `studentstay_users` ADD `last_name` varchar(255) NOT NULL;