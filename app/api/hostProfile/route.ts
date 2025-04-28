import { NextResponse } from "next/server";
import { db } from "@/lib/model";
import { hostProfiles } from "@/lib/model/schema";
import { z } from "zod";
import { createUpdateSchema } from "drizzle-zod";
import parsePhoneNumber from "libphonenumber-js";
import { eq } from "drizzle-orm";
import { phoneNumberValidation } from "@/lib/validation/schemas";

const updateSchema = createUpdateSchema(hostProfiles, {
  phoneNumber: phoneNumberValidation,
});

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const validatedData = updateSchema.parse(data);

    await db
      .update(hostProfiles)
      .set(validatedData)
      .where(eq(hostProfiles.id, data.id))
      .execute();

    return NextResponse.json(
      { message: "Host profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating host profile:", error);
    return NextResponse.json(
      { error: "Failed to update host profile" },
      { status: 500 }
    );
  }
}
