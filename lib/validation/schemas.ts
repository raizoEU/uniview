import { studentstay_user } from "@/auth-schema";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { bookings, listings, payments, studentProfiles } from "../model/schema";

// Schema for updating bookings
export const updateBookingSchema = z.object({
  id: z.string(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  paymentStatus: z.enum(["pending", "successful", "failed"]).optional(),
  paymentMethod: z.enum(["card", "paypal", "bank-transfer"]).optional(),
  totalPrice: z.number().optional(),
  notes: z.string().optional(),
});

export type UpdateBookingSchema = z.infer<typeof updateBookingSchema>;
import { phoneNumberValidation } from "./chains";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createListingSchema = createInsertSchema(listings, {
  universityId: z.string().min(1, { message: "University is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  location: z.string().min(1, { message: "Location is required" }),
});

export const updateUserSchema = createUpdateSchema(studentstay_user, {
  id: z.string().optional(),
  name: z.string().min(1, "Needs to be a minimum length of 1").optional(),
  email: z.string().email("Invalid email").optional(),
  image: z.string().optional(),
});

export const paymentSchema = createInsertSchema(payments, {
  id: z.string().optional(),
  paymentMethod: z.enum(["card", "paypal", "bank-transfer"]),
  amount: z.string().optional(),
});

export const createBookingSchema = createInsertSchema(bookings, {
  id: z.string().optional(),
  universityId: z.string().min(1, { message: "University is required" }),
  startDate: z
    .string()
    .min(1, { message: "Start date is required" })
    .optional(),
  endDate: z.string().min(1, { message: "End date is required" }).optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
  listingId: z.string().min(1, { message: "Listing is required" }),
}).merge(paymentSchema);

export const updateStudentProfileSchema = createUpdateSchema(studentProfiles, {
  id: z.string().optional(),
  biography: z.string().optional(),
  phoneNumber: z
    .string()
    .optional()
    .superRefine((val, ctx) => {
      if (val) {
        const transformedPhone = phoneNumberValidation.safeParse(val);
        if (transformedPhone.success === false) {
          ctx.addIssue({
            path: ["phoneNumber"],
            message: "Invalid phone number",
            code: z.ZodIssueCode.custom,
          });
        }
      }
    }),
});
