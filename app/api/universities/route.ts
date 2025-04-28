import { NextResponse } from "next/server";
import { db } from "@/lib/model";
import { universities } from "@/lib/model/schema";

export async function GET() {
  try {
    const allUniversities = await db.select().from(universities);
    return NextResponse.json(allUniversities);
  } catch (error) {
    console.error("Error fetching universities:", error);
    return NextResponse.json(
      { error: "Failed to fetch universities" },
      { status: 500 }
    );
  }
}
