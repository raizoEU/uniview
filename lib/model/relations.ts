import { relations } from "drizzle-orm/relations";
import {
  listings,
  reviews,
  universities,
  notifications,
  bookings,
  payments,
  propertyImages,
  savedListings,
  studentProfiles,
  hostProfiles,
} from "./schema";

import {
  studentstay_account as account,
  studentstay_session as session,
  studentstay_user as user,
} from "../../auth-schema";

export const reviewsRelations = relations(reviews, ({ one }) => ({
  listing: one(listings, {
    fields: [reviews.listingId],
    references: [listings.id],
  }),
  user: one(user, {
    fields: [reviews.userId],
    references: [user.id],
  }),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  reviews: many(reviews),
  user: one(user, {
    fields: [listings.hostId],
    references: [user.id],
  }),
  university: one(universities, {
    fields: [listings.universityId],
    references: [universities.id],
  }),
  propertyImages: many(propertyImages),
  savedListings: many(savedListings),
  bookings: many(bookings),
}));

export const userRelations = relations(user, ({ many }) => ({
  reviews: many(reviews),
  listings: many(listings),
  notifications: many(notifications),
  payments: many(payments),
  savedListings: many(savedListings),
  studentProfiles: many(studentProfiles),
  hostProfiles: many(hostProfiles),
  bookings: many(bookings),
  accounts: many(account),
  sessions: many(session),
}));

export const universitiesRelations = relations(universities, ({ many }) => ({
  listings: many(listings),
  bookings: many(bookings),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(user, {
    fields: [notifications.userId],
    references: [user.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
  user: one(user, {
    fields: [payments.studentId],
    references: [user.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  payments: many(payments),
  user: one(user, {
    fields: [bookings.studentId],
    references: [user.id],
  }),
  listing: one(listings, {
    fields: [bookings.listingId],
    references: [listings.id],
  }),
  university: one(universities, {
    fields: [bookings.universityId],
    references: [universities.id],
  }),
}));

export const propertyImagesRelations = relations(propertyImages, ({ one }) => ({
  listing: one(listings, {
    fields: [propertyImages.listingId],
    references: [listings.id],
  }),
}));

export const savedListingsRelations = relations(savedListings, ({ one }) => ({
  user: one(user, {
    fields: [savedListings.studentId],
    references: [user.id],
  }),
  listing: one(listings, {
    fields: [savedListings.listingId],
    references: [listings.id],
  }),
}));

export const studentProfilesRelations = relations(
  studentProfiles,
  ({ one }) => ({
    user: one(user, {
      fields: [studentProfiles.id],
      references: [user.id],
    }),
  })
);

export const hostProfilesRelations = relations(hostProfiles, ({ one }) => ({
  user: one(user, {
    fields: [hostProfiles.id],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));
