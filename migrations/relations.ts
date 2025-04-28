import { relations } from "drizzle-orm/relations";
import { studentstayListings, studentstayReviews, studentstayUser, studentstayUniversities, studentstayNotifications, studentstayBookings, studentstayPayments, studentstayPropertyImages, studentstaySavedListings, studentstayStudentProfiles, studentstayHostProfiles, studentstayAccount, studentstaySession } from "./schema";

export const studentstayReviewsRelations = relations(studentstayReviews, ({one}) => ({
	studentstayListing: one(studentstayListings, {
		fields: [studentstayReviews.listingId],
		references: [studentstayListings.id]
	}),
	studentstayUser: one(studentstayUser, {
		fields: [studentstayReviews.userId],
		references: [studentstayUser.id]
	}),
}));

export const studentstayListingsRelations = relations(studentstayListings, ({one, many}) => ({
	studentstayReviews: many(studentstayReviews),
	studentstayUser: one(studentstayUser, {
		fields: [studentstayListings.hostId],
		references: [studentstayUser.id]
	}),
	studentstayUniversity: one(studentstayUniversities, {
		fields: [studentstayListings.universityId],
		references: [studentstayUniversities.id]
	}),
	studentstayPropertyImages: many(studentstayPropertyImages),
	studentstaySavedListings: many(studentstaySavedListings),
	studentstayBookings: many(studentstayBookings),
}));

export const studentstayUserRelations = relations(studentstayUser, ({many}) => ({
	studentstayReviews: many(studentstayReviews),
	studentstayListings: many(studentstayListings),
	studentstayNotifications: many(studentstayNotifications),
	studentstayPayments: many(studentstayPayments),
	studentstaySavedListings: many(studentstaySavedListings),
	studentstayStudentProfiles: many(studentstayStudentProfiles),
	studentstayHostProfiles: many(studentstayHostProfiles),
	studentstayBookings: many(studentstayBookings),
	studentstayAccounts: many(studentstayAccount),
	studentstaySessions: many(studentstaySession),
}));

export const studentstayUniversitiesRelations = relations(studentstayUniversities, ({many}) => ({
	studentstayListings: many(studentstayListings),
	studentstayBookings: many(studentstayBookings),
}));

export const studentstayNotificationsRelations = relations(studentstayNotifications, ({one}) => ({
	studentstayUser: one(studentstayUser, {
		fields: [studentstayNotifications.userId],
		references: [studentstayUser.id]
	}),
}));

export const studentstayPaymentsRelations = relations(studentstayPayments, ({one}) => ({
	studentstayBooking: one(studentstayBookings, {
		fields: [studentstayPayments.bookingId],
		references: [studentstayBookings.id]
	}),
	studentstayUser: one(studentstayUser, {
		fields: [studentstayPayments.studentId],
		references: [studentstayUser.id]
	}),
}));

export const studentstayBookingsRelations = relations(studentstayBookings, ({one, many}) => ({
	studentstayPayments: many(studentstayPayments),
	studentstayUser: one(studentstayUser, {
		fields: [studentstayBookings.studentId],
		references: [studentstayUser.id]
	}),
	studentstayListing: one(studentstayListings, {
		fields: [studentstayBookings.listingId],
		references: [studentstayListings.id]
	}),
	studentstayUniversity: one(studentstayUniversities, {
		fields: [studentstayBookings.universityId],
		references: [studentstayUniversities.id]
	}),
}));

export const studentstayPropertyImagesRelations = relations(studentstayPropertyImages, ({one}) => ({
	studentstayListing: one(studentstayListings, {
		fields: [studentstayPropertyImages.listingId],
		references: [studentstayListings.id]
	}),
}));

export const studentstaySavedListingsRelations = relations(studentstaySavedListings, ({one}) => ({
	studentstayUser: one(studentstayUser, {
		fields: [studentstaySavedListings.studentId],
		references: [studentstayUser.id]
	}),
	studentstayListing: one(studentstayListings, {
		fields: [studentstaySavedListings.listingId],
		references: [studentstayListings.id]
	}),
}));

export const studentstayStudentProfilesRelations = relations(studentstayStudentProfiles, ({one}) => ({
	studentstayUser: one(studentstayUser, {
		fields: [studentstayStudentProfiles.id],
		references: [studentstayUser.id]
	}),
}));

export const studentstayHostProfilesRelations = relations(studentstayHostProfiles, ({one}) => ({
	studentstayUser: one(studentstayUser, {
		fields: [studentstayHostProfiles.id],
		references: [studentstayUser.id]
	}),
}));

export const studentstayAccountRelations = relations(studentstayAccount, ({one}) => ({
	studentstayUser: one(studentstayUser, {
		fields: [studentstayAccount.userId],
		references: [studentstayUser.id]
	}),
}));

export const studentstaySessionRelations = relations(studentstaySession, ({one}) => ({
	studentstayUser: one(studentstayUser, {
		fields: [studentstaySession.userId],
		references: [studentstayUser.id]
	}),
}));