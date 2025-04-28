import { studentstay_user } from "@/auth-schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/model";
import { studentProfiles } from "@/lib/model/schema";
import { getSession } from "@/lib/service/get-session";
import {
  updateStudentProfileSchema,
  updateUserSchema,
} from "@/lib/validation/schemas";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const updateStudentSchema = updateUserSchema.merge(updateStudentProfileSchema);

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    // Check if there is a valid session
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    const {
      id,
      createdAt,
      email,
      image,
      updatedAt,
      emailVerified,
      biography,
      phoneNumber,
      ...parsedData
    } = updateStudentSchema.parse(body);

    // Check if the user is trying to update their own data
    if (id !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update name & role on the user database. Email requires special handling.
    await db
      .update(studentstay_user)
      .set({ updatedAt: new Date(), ...parsedData })
      .where(eq(studentstay_user.id, id));

    // Use better-auth to update the user's email
    if (email) {
      await auth.api.changeEmail({
        body: { newEmail: email },
        headers: headers(),
      });
    }

    // Now handle things that are specific to the user's role (student)
    if (biography || phoneNumber) {
      db.update(studentProfiles)
        .set({ biography, phoneNumber })
        .where(eq(studentProfiles.id, id));
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
