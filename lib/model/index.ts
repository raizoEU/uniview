import { NeonHttpDatabase, drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as authSchema from "@/auth-schema";
import * as schema from "@/lib/model/schema";
import * as relations from "@/lib/model/relations";

config({ path: ".env" });

const mergedSchema = { ...authSchema, ...schema, ...relations };

const sql = neon(process.env.DATABASE_URL!);
export const db: NeonHttpDatabase<typeof mergedSchema> = drizzle({
  client: sql,
  schema: mergedSchema,
});
