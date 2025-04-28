"server only";

import { db } from "@/lib/model";
import { Listings } from "../model/types";

export type FeaturedListingsResponse = Listings & {
  university: {
    name: string | null;
  } | null;
  propertyImages:
    | {
        imageUrl: string | null;
      }[]
    | null;
};

export const getFeaturedListings = async (): Promise<
  FeaturedListingsResponse[]
> => {
  return await db.query.listings.findMany({
    with: {
      propertyImages: {
        columns: {
          imageUrl: true,
        },
      },
      university: {
        columns: {
          name: true,
        },
      },
    },
    orderBy(fields, operators) {
      return operators.desc(fields.createdAt);
    },
    limit: 3,
  });
};
