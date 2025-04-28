import { getUniversities } from "@/lib/service/universities";
import CreateListingForm from "../_components/create-listing/create-listing-form";

export default async function CreateListingPage() {
  const universityList = await getUniversities();

  return <CreateListingForm universities={universityList} />;
}
