import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

export default defineConfig({
  schema: ["./lib/model/schema.ts", "./auth-schema.ts"],
  out: "./migrations",
  tablesFilter: ["studentstay_*"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
