import { BadRequestError } from "../errors/errors";
import { db } from "../model";

export const getListingById = async (id: string) => {
  if (!id) {
    throw new BadRequestError("A ListingID is required");
  }

  return await db.query.listings.findFirst({
    where(fields, operators) {
      return operators.and(operators.eq(fields.id, id));
    },
    with: {
      propertyImages: {
        where(fields, operators) {
          return operators.eq(fields.listingId, id);
        },
      },
    },
  });
};
