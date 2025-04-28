"server only";

import { db } from "../model";

export const getUniversities = async () => {
  return await db.query.universities.findMany();
};
