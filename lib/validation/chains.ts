// Zod validation chains

import parsePhoneNumberFromString from "libphonenumber-js";
import { z } from "zod";

export const phoneNumberValidation = z.string().transform((value, ctx) => {
  const phoneNumber = parsePhoneNumberFromString(value, {
    defaultCountry: "GB",
  });

  if (!phoneNumber?.isValid()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid phone number",
    });
    return z.NEVER;
  }

  return phoneNumber.formatInternational();
});
