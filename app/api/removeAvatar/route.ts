import { studentstay_user } from "@/auth-schema";
import { db } from "@/lib/model";
import { getSession } from "@/lib/service/get-session";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    // Check if there is a valid session
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete the old image from the database
    await db
      .update(studentstay_user)
      .set({ image: null })
      .where(eq(studentstay_user.id, session.user.id));

    return NextResponse.json({ message: "Avatar removed successfully" });
  } catch (error) {
    console.error("Error removing avatar:", error);
    return NextResponse.json(
      { error: "Failed to remove avatar" },
      { status: 500 }
    );
  }
}
