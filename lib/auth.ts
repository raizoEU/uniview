import { db } from "@/lib/model";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "../auth-schema";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { hostProfiles, studentProfiles } from "./model/schema";
import { create } from "domain";

export const createHostProfileForHost = async (userId: string) => {
  try {
    await db.insert(hostProfiles).values({
      id: userId,
    });
  } catch (error) {
    throw new APIError("BAD_REQUEST", {
      message: "Failed to create host profile",
    });
  }
};

export const createStudentProfileForStudent = async (userId: string) => {
  try {
    await db.insert(studentProfiles).values({
      id: userId,
    });
  } catch (error) {
    throw new APIError("BAD_REQUEST", {
      message: "Failed to create student profile",
    });
  }
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        const newSession = ctx.context.newSession;
        if (newSession?.user.role === "host") {
          createHostProfileForHost(newSession.user.id);
        }
        if (newSession?.user.role === "student") {
          createStudentProfileForStudent(newSession.user.id);
        }
      }
    }),
  },
  user: {
    modelName: "studentstay_user",
    changeEmail: {
      enabled: true,
    },
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "student",
        input: true,
      },
    },
  },
  account: {
    modelName: "studentstay_account",
  },
  session: {
    modelName: "studentstay_session",
  },
  verification: {
    modelName: "studentstay_verification",
  },
  plugins: [nextCookies()],
});
