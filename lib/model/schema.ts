import { studentstay_user } from "@/auth-schema";
import {
  boolean,
  decimal,
  pgEnum,
  pgTableCreator,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `studentstay_${name}`);

const user = studentstay_user;

// Enum Definitions
export const bookingStatusEnum = pgEnum("studentstay_booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);
export const paymentMethodEnum = pgEnum("studentstay_payment_method", [
  "card",
  "paypal",
  "bank-transfer",
]);
export const paymentStatusEnum = pgEnum("studentstay_payment_status", [
  "pending",
  "successful",
  "failed",
]);

// Host Profiles Table
export const hostProfiles = createTable("host_profiles", {
  id: text("id")
    .primaryKey()
    .references(() => user.id),
  businessName: varchar("business_name", { length: 255 }),
  biography: varchar("biography"),
  phoneNumber: varchar("phone_number", { length: 20 }),
  taxId: varchar("tax_id", { length: 255 }),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Student Profiles Table
export const studentProfiles = createTable("student_profiles", {
  id: text("id")
    .primaryKey()
    .references(() => user.id),
  biography: varchar("biography"),
  phoneNumber: varchar("phone_number", { length: 20 }),
});

// Listings Table
export const listings = createTable("listings", {
  id: text("id").primaryKey(),
  hostId: text("host_id").references(() => user.id),
  universityId: text("university_id").references(() => universities.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  availableFrom: timestamp("available_from").notNull(),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bookings Table
export const bookings = createTable("bookings", {
  id: text("id").primaryKey(),
  studentId: text("student_id").references(() => user.id),
  listingId: text("listing_id").references(() => listings.id, {
    onDelete: "cascade",
  }),
  universityId: text("university_id").references(() => universities.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: bookingStatusEnum().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payments Table
export const payments = createTable("payments", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id").references(() => bookings.id, {
    onDelete: "cascade",
  }),
  studentId: text("student_id").references(() => user.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: paymentMethodEnum().default("card"),
  status: paymentStatusEnum().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Saved Listings Table
export const savedListings = createTable("saved_listings", {
  id: text("id").primaryKey(),
  studentId: text("student_id").references(() => user.id),
  listingId: text("listing_id").references(() => listings.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Universities Table
export const universities = createTable("universities", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Property Images Table
export const propertyImages = createTable("property_images", {
  id: text("id").primaryKey(),
  listingId: text("listing_id").references(() => listings.id, {
    onDelete: "cascade",
  }),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications Table
export const notifications = createTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
// Reviews Table
export const reviews = createTable("reviews", {
  id: text("id").primaryKey(),
  listingId: text("listing_id").references(() => listings.id, {
    onDelete: "cascade",
  }),
  userId: text("user_id").references(() => user.id),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
