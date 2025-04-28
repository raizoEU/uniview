import { cache } from "react";
import { auth } from "../auth";
import { headers } from "next/headers";

export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  return session;
});
