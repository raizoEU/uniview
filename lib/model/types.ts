import { InferSelectModel } from "drizzle-orm";
import { bookings, hostProfiles, listings, payments, propertyImages, reviews, universities } from "./schema";
import { studentstay_user } from "@/auth-schema";

export type Payments = InferSelectModel<typeof payments>;
export type Students = InferSelectModel<typeof studentstay_user>;
export type Listings = InferSelectModel<typeof listings>;
export type Bookings = InferSelectModel<typeof bookings>;
export type Universities = InferSelectModel<typeof universities>;
export type PropertyImages = InferSelectModel<typeof propertyImages>;
export type HostProfiles = InferSelectModel<typeof hostProfiles>;
export type User = InferSelectModel<typeof studentstay_user>;
export type Reviews = InferSelectModel<typeof reviews>;