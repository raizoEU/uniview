import { pgTable, foreignKey, text, numeric, timestamp, varchar, boolean, unique, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const studentstayBookingStatus = pgEnum("studentstay_booking_status", ['pending', 'confirmed', 'cancelled', 'completed'])
export const studentstayPaymentMethod = pgEnum("studentstay_payment_method", ['card', 'paypal', 'bank-transfer'])
export const studentstayPaymentStatus = pgEnum("studentstay_payment_status", ['pending', 'successful', 'failed'])


export const studentstayReviews = pgTable("studentstay_reviews", {
	id: text().primaryKey().notNull(),
	listingId: text("listing_id"),
	userId: text("user_id"),
	rating: numeric({ precision: 2, scale:  1 }).notNull(),
	review: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.listingId],
			foreignColumns: [studentstayListings.id],
			name: "studentstay_reviews_listing_id_studentstay_listings_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [studentstayUser.id],
			name: "studentstay_reviews_user_id_studentstay_user_id_fk"
		}),
]);

export const studentstayListings = pgTable("studentstay_listings", {
	id: text().primaryKey().notNull(),
	hostId: text("host_id"),
	universityId: text("university_id"),
	title: varchar({ length: 255 }).notNull(),
	description: varchar().notNull(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	location: varchar({ length: 255 }).notNull(),
	latitude: numeric({ precision: 10, scale:  7 }).notNull(),
	longitude: numeric({ precision: 10, scale:  7 }).notNull(),
	availableFrom: timestamp("available_from", { mode: 'string' }).notNull(),
	isVerified: boolean("is_verified").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.hostId],
			foreignColumns: [studentstayUser.id],
			name: "studentstay_listings_host_id_studentstay_user_id_fk"
		}),
	foreignKey({
			columns: [table.universityId],
			foreignColumns: [studentstayUniversities.id],
			name: "studentstay_listings_university_id_studentstay_universities_id_"
		}),
]);

export const studentstayNotifications = pgTable("studentstay_notifications", {
	id: text().primaryKey().notNull(),
	userId: text("user_id"),
	message: text().notNull(),
	isRead: boolean("is_read").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [studentstayUser.id],
			name: "studentstay_notifications_user_id_studentstay_user_id_fk"
		}),
]);

export const studentstayUniversities = pgTable("studentstay_universities", {
	id: text().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	latitude: numeric({ precision: 10, scale:  7 }).notNull(),
	longitude: numeric({ precision: 10, scale:  7 }).notNull(),
	city: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const studentstayPayments = pgTable("studentstay_payments", {
	id: text().primaryKey().notNull(),
	bookingId: text("booking_id"),
	studentId: text("student_id"),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	paymentMethod: studentstayPaymentMethod().default('card'),
	status: studentstayPaymentStatus().default('pending'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.bookingId],
			foreignColumns: [studentstayBookings.id],
			name: "studentstay_payments_booking_id_studentstay_bookings_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [studentstayUser.id],
			name: "studentstay_payments_student_id_studentstay_user_id_fk"
		}),
]);

export const studentstayPropertyImages = pgTable("studentstay_property_images", {
	id: text().primaryKey().notNull(),
	listingId: text("listing_id"),
	imageUrl: varchar("image_url", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.listingId],
			foreignColumns: [studentstayListings.id],
			name: "studentstay_property_images_listing_id_studentstay_listings_id_"
		}).onDelete("cascade"),
]);

export const studentstaySavedListings = pgTable("studentstay_saved_listings", {
	id: text().primaryKey().notNull(),
	studentId: text("student_id"),
	listingId: text("listing_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [studentstayUser.id],
			name: "studentstay_saved_listings_student_id_studentstay_user_id_fk"
		}),
	foreignKey({
			columns: [table.listingId],
			foreignColumns: [studentstayListings.id],
			name: "studentstay_saved_listings_listing_id_studentstay_listings_id_f"
		}).onDelete("cascade"),
]);

export const studentstayStudentProfiles = pgTable("studentstay_student_profiles", {
	id: text().primaryKey().notNull(),
	biography: varchar(),
	phoneNumber: varchar("phone_number", { length: 20 }),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [studentstayUser.id],
			name: "studentstay_student_profiles_id_studentstay_user_id_fk"
		}),
]);

export const studentstayHostProfiles = pgTable("studentstay_host_profiles", {
	id: text().primaryKey().notNull(),
	businessName: varchar("business_name", { length: 255 }),
	biography: varchar(),
	phoneNumber: varchar("phone_number", { length: 20 }),
	taxId: varchar("tax_id", { length: 255 }),
	verified: boolean().default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [studentstayUser.id],
			name: "studentstay_host_profiles_id_studentstay_user_id_fk"
		}),
]);

export const studentstayBookings = pgTable("studentstay_bookings", {
	id: text().primaryKey().notNull(),
	studentId: text("student_id"),
	listingId: text("listing_id"),
	universityId: text("university_id"),
	startDate: timestamp("start_date", { mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { mode: 'string' }).notNull(),
	status: studentstayBookingStatus().default('pending'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [studentstayUser.id],
			name: "studentstay_bookings_student_id_studentstay_user_id_fk"
		}),
	foreignKey({
			columns: [table.listingId],
			foreignColumns: [studentstayListings.id],
			name: "studentstay_bookings_listing_id_studentstay_listings_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.universityId],
			foreignColumns: [studentstayUniversities.id],
			name: "studentstay_bookings_university_id_studentstay_universities_id_"
		}),
]);

export const studentstayVerification = pgTable("studentstay_verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const studentstayAccount = pgTable("studentstay_account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [studentstayUser.id],
			name: "studentstay_account_user_id_studentstay_user_id_fk"
		}).onDelete("cascade"),
]);

export const studentstaySession = pgTable("studentstay_session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [studentstayUser.id],
			name: "studentstay_session_user_id_studentstay_user_id_fk"
		}).onDelete("cascade"),
	unique("studentstay_session_token_unique").on(table.token),
]);

export const studentstayUser = pgTable("studentstay_user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	role: text().notNull(),
}, (table) => [
	unique("studentstay_user_email_unique").on(table.email),
]);
